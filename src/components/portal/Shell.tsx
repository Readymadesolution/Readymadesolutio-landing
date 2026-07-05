"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import SpaceDashboardOutlined from "@mui/icons-material/SpaceDashboardOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import GroupAddOutlined from "@mui/icons-material/GroupAddOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

const DRAWER_WIDTH = 256;

type NavItem = { label: string; href: string; icon: SvgIconComponent };

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/portal", icon: SpaceDashboardOutlined },
  { label: "Leads", href: "/portal/leads", icon: PeopleAltOutlined },
  { label: "Calendar", href: "/portal/calendar", icon: CalendarMonthOutlined },
  { label: "Team", href: "/portal/team", icon: GroupAddOutlined },
  { label: "Settings", href: "/portal/settings", icon: SettingsOutlined },
];

function isActive(pathname: string, href: string) {
  return href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
}

function DrawerContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 2.5, py: 2.25 }}>
        <Box
          component="img"
          src="/assets/logo-mark.png"
          alt="Readymade"
          sx={{ width: 32, height: 29, objectFit: "contain" }}
        />
        <Box sx={{ lineHeight: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "text.primary", lineHeight: 1 }}>
            READYMADE
          </Typography>
          <Typography
            sx={{ fontSize: 9.5, letterSpacing: "0.14em", color: "primary.dark", mt: 0.25 }}
          >
            CONSOLE
          </Typography>
        </Box>
      </Box>

      {/* Nav */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <ListItemButton
              key={href}
              component={NextLink}
              href={href}
              onClick={onNavigate}
              selected={active}
              sx={{
                borderRadius: 2.5,
                mb: 0.25,
                py: 1,
                color: "text.secondary",
                "& .MuiListItemIcon-root": { color: "text.secondary", minWidth: 34 },
                "&:hover": { bgcolor: "grey.100" },
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.dark",
                  "& .MuiListItemIcon-root": { color: "primary.dark" },
                  "&:hover": { bgcolor: "primary.light" },
                },
              }}
            >
              <ListItemIcon>
                <Icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{ primary: { sx: { fontSize: 14.5, fontWeight: active ? 700 : 500 } } }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Account */}
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            p: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 13, fontWeight: 600 }}>
            RS
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
              Readymade Team
            </Typography>
            <Typography noWrap sx={{ fontSize: 11, color: "text.secondary" }}>
              hello@readymade.io
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = [...NAV].reverse().find((n) => isActive(pathname, n.href))?.label ?? "Portal";

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}>
      {/* Permanent drawer — md+ */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderColor: "divider",
          },
        }}
      >
        <DrawerContent pathname={pathname} />
      </Drawer>

      {/* Temporary drawer — mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <DrawerContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      {/* Main column */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <IconButton
              edge="start"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
              {title}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Notifications">
              <IconButton aria-label="Notifications">
                <Badge color="primary" variant="dot">
                  <NotificationsNoneOutlined />
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 13, fontWeight: 600 }}>
              RS
            </Avatar>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ p: 3, bgcolor: "background.default", minHeight: "100dvh" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
