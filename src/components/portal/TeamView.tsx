"use client";

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import PersonAddAlt1Outlined from "@mui/icons-material/PersonAddAlt1Outlined";
import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import MailOutline from "@mui/icons-material/MailOutlineOutlined";
import { authClient } from "@/lib/auth/client";
import { logAudit } from "@/app/portal/team/actions";

type Role = "owner" | "admin" | "member";

type Member = {
  id: string; // membership id
  userId: string;
  role: Role;
  name: string;
  email: string;
};

type Invitation = {
  id: string;
  email: string;
  role: Role;
};

const ORG_NAME = "ReadyMade Solution";
const ORG_SLUG = "readymade";

const roleChipColor: Record<Role, "default" | "primary" | "secondary"> = {
  owner: "secondary",
  admin: "primary",
  member: "default",
};

function acceptLink(invitationId: string) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/auth/accept-invitation?invitationId=${invitationId}`;
}

export default function TeamView() {
  const { data: session } = authClient.useSession();
  const myUserId = session?.user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const myRole: Role | null =
    members.find((m) => m.userId === myUserId)?.role ?? null;
  const canManage = myRole === "owner" || myRole === "admin";

  const loadFull = useCallback(async (id: string) => {
    const { data, error: fErr } = await authClient.organization.getFullOrganization({
      query: { organizationId: id },
    });
    if (fErr || !data) {
      throw new Error(fErr?.message ?? "Could not load the organization.");
    }
    setMembers(
      data.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        name: m.user?.name || m.user?.email || "Unknown",
        email: m.user?.email ?? "",
      })),
    );
    setInvitations(
      data.invitations
        .filter((inv) => inv.status === "pending")
        .map((inv) => ({ id: inv.id, email: inv.email, role: inv.role })),
    );
  }, []);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: orgs, error: listErr } = await authClient.organization.list();
      if (listErr) throw new Error(listErr.message ?? "Could not load organizations.");

      let id: string;
      if (!orgs || orgs.length === 0) {
        const { data: created, error: createErr } = await authClient.organization.create({
          name: ORG_NAME,
          slug: ORG_SLUG,
        });
        if (createErr || !created) {
          throw new Error(createErr?.message ?? "Could not create the organization.");
        }
        id = created.id;
      } else {
        id = orgs[0].id;
      }

      await authClient.organization.setActive({ organizationId: id });
      setOrgId(id);
      await loadFull(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [loadFull]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const refresh = useCallback(async () => {
    if (orgId) await loadFull(orgId);
  }, [orgId, loadFull]);

  async function copyLink(invitationId: string) {
    try {
      await navigator.clipboard.writeText(acceptLink(invitationId));
      setToast("Invite link copied to clipboard.");
    } catch {
      setToast("Could not copy — select and copy the link manually.");
    }
  }

  // ---- Member actions ----
  async function changeRole(m: Member, role: "admin" | "member") {
    const { error: err } = await authClient.organization.updateMemberRole({
      memberId: m.id,
      role,
      organizationId: orgId ?? undefined,
    });
    if (err) {
      setToast(err.message ?? "Could not update the role.");
      return;
    }
    await logAudit("member.role_changed", `${m.email} → ${role}`);
    await refresh();
    setToast(`${m.email} is now ${role}.`);
  }

  async function removeMember(m: Member) {
    const { error: err } = await authClient.organization.removeMember({
      memberIdOrEmail: m.id,
      organizationId: orgId ?? undefined,
    });
    if (err) {
      setToast(err.message ?? "Could not remove the member.");
      return;
    }
    await logAudit("member.removed", m.email);
    await refresh();
    setToast(`${m.email} was removed.`);
  }

  async function cancelInvitation(inv: Invitation) {
    const { error: err } = await authClient.organization.cancelInvitation({
      invitationId: inv.id,
    });
    if (err) {
      setToast(err.message ?? "Could not cancel the invitation.");
      return;
    }
    await logAudit("invite.cancelled", inv.email);
    await refresh();
    setToast(`Invitation to ${inv.email} cancelled.`);
  }

  return (
    <Box sx={{ maxWidth: 920 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
            {ORG_NAME}
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "text.secondary", mt: 0.25 }}>
            Manage who has access to the console.
          </Typography>
        </Box>
        <InviteButton
          disabled={loading || !orgId || !canManage}
          orgId={orgId}
          onInvited={refresh}
          onToast={setToast}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }} action={<Button color="inherit" size="small" onClick={() => void bootstrap()}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {/* Members */}
      <Paper variant="outlined" sx={{ borderRadius: 4, mb: 2.5, overflow: "hidden" }}>
        <SectionHeader
          title="Members"
          count={loading ? undefined : members.length}
        />
        <Divider />
        {loading ? (
          <RowSkeletons />
        ) : (
          <List disablePadding>
            {members.map((m, i) => (
              <MemberRow
                key={m.id}
                member={m}
                isSelf={m.userId === myUserId}
                canManage={canManage}
                divider={i < members.length - 1}
                onChangeRole={changeRole}
                onRemove={removeMember}
              />
            ))}
          </List>
        )}
      </Paper>

      {/* Pending invitations */}
      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
        <SectionHeader
          title="Pending invitations"
          count={loading ? undefined : invitations.length}
        />
        <Divider />
        {loading ? (
          <RowSkeletons />
        ) : invitations.length === 0 ? (
          <Box sx={{ px: 2.5, py: 5, textAlign: "center" }}>
            <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
              No pending invitations.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {invitations.map((inv, i) => (
              <ListItem
                key={inv.id}
                divider={i < invitations.length - 1}
                sx={{ px: 2.5, py: 1.25 }}
                secondaryAction={
                  canManage && (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Copy invite link">
                        <IconButton edge="end" aria-label="Copy invite link" onClick={() => void copyLink(inv.id)}>
                          <ContentCopyOutlined sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Button size="small" color="error" onClick={() => void cancelInvitation(inv)}>
                        Cancel
                      </Button>
                    </Box>
                  )
                }
              >
                <ListItemAvatar sx={{ minWidth: 46 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "grey.100", color: "text.secondary" }}>
                    <MailOutline sx={{ fontSize: 18 }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={inv.email}
                  secondary={<Chip size="small" label={inv.role} color={roleChipColor[inv.role]} sx={{ mt: 0.5, textTransform: "capitalize" }} />}
                  slotProps={{
                    primary: { noWrap: true, sx: { fontSize: 14, fontWeight: 600 } },
                    secondary: { component: "span" },
                  }}
                  sx={{ pr: 14 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, py: 1.75 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{title}</Typography>
      {count !== undefined && (
        <Chip size="small" label={count} sx={{ bgcolor: "grey.100", fontWeight: 600 }} />
      )}
    </Box>
  );
}

function RowSkeletons() {
  return (
    <Box sx={{ px: 2.5, py: 2 }}>
      {[0, 1, 2].map((i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="30%" />
            <Skeleton width="45%" />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function MemberRow({
  member,
  isSelf,
  canManage,
  divider,
  onChangeRole,
  onRemove,
}: {
  member: Member;
  isSelf: boolean;
  canManage: boolean;
  divider: boolean;
  onChangeRole: (m: Member, role: "admin" | "member") => void | Promise<void>;
  onRemove: (m: Member) => void | Promise<void>;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOwner = member.role === "owner";
  // Owner and yourself cannot be removed; owner's role cannot be changed.
  const protectedRow = isOwner || isSelf;
  const showMenu = canManage && !isOwner;

  return (
    <ListItem
      divider={divider}
      sx={{ px: 2.5, py: 1.25 }}
      secondaryAction={
        showMenu ? (
          <>
            <IconButton edge="end" aria-label={`Manage ${member.email}`} onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVertOutlined sx={{ fontSize: 20 }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem
                disabled={member.role === "admin"}
                onClick={() => {
                  setAnchorEl(null);
                  void onChangeRole(member, "admin");
                }}
              >
                Make admin
              </MenuItem>
              <MenuItem
                disabled={member.role === "member"}
                onClick={() => {
                  setAnchorEl(null);
                  void onChangeRole(member, "member");
                }}
              >
                Make member
              </MenuItem>
              <Divider />
              <MenuItem
                disabled={protectedRow}
                sx={{ color: "error.main" }}
                onClick={() => {
                  setAnchorEl(null);
                  void onRemove(member);
                }}
              >
                Remove
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Chip size="small" label={member.role} color={roleChipColor[member.role]} sx={{ textTransform: "capitalize" }} />
        )
      }
    >
      <ListItemAvatar sx={{ minWidth: 46 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.light", color: "primary.dark", fontSize: 14, fontWeight: 700 }}>
          {(member.name || member.email).slice(0, 1).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 600 }}>
              {member.name}
            </Typography>
            {isSelf && (
              <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>(you)</Typography>
            )}
            {showMenu && (
              <Chip size="small" label={member.role} color={roleChipColor[member.role]} sx={{ height: 20, textTransform: "capitalize" }} />
            )}
          </Box>
        }
        secondary={member.email}
        slotProps={{
          primary: { component: "div" },
          secondary: { noWrap: true, sx: { fontSize: 12.5 } },
        }}
        sx={{ pr: 6 }}
      />
    </ListItem>
  );
}

function InviteButton({
  disabled,
  orgId,
  onInvited,
  onToast,
}: {
  disabled: boolean;
  orgId: string | null;
  onInvited: () => void | Promise<void>;
  onToast: (msg: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successLink, setSuccessLink] = useState<string | null>(null);

  function close() {
    setOpen(false);
    // reset after the dialog animates out
    setTimeout(() => {
      setEmail("");
      setRole("member");
      setFormError(null);
      setSuccessLink(null);
      setSubmitting(false);
    }, 200);
  }

  async function submit() {
    setFormError(null);
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFormError("Enter a valid email address.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await authClient.organization.inviteMember({
      email: value,
      role,
      organizationId: orgId ?? undefined,
    });
    setSubmitting(false);
    if (error || !data) {
      setFormError(error?.message ?? "Could not send the invitation.");
      return;
    }
    await logAudit("invite.created", `${value} (${role})`);
    setSuccessLink(acceptLink(data.id));
    await onInvited();
  }

  async function copySuccess() {
    if (!successLink) return;
    try {
      await navigator.clipboard.writeText(successLink);
      onToast("Invite link copied to clipboard.");
    } catch {
      onToast("Could not copy — select the link manually.");
    }
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<PersonAddAlt1Outlined />}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        Invite
      </Button>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
        {successLink ? (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
              <CheckCircleOutlined sx={{ color: "success.main" }} />
              Invitation sent
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ fontSize: 13.5, color: "text.secondary", mb: 2 }}>
                Share this link so they can accept the invite and join the team.
              </Typography>
              <Card variant="outlined" sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1, bgcolor: "grey.100" }}>
                <Typography sx={{ flex: 1, fontFamily: (t) => t.typography.caption.fontFamily, fontSize: 12, wordBreak: "break-all" }}>
                  {successLink}
                </Typography>
                <Tooltip title="Copy link">
                  <IconButton aria-label="Copy link" onClick={() => void copySuccess()}>
                    <ContentCopyOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Card>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button variant="contained" onClick={close}>Done</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Invite a teammate</DialogTitle>
            <DialogContent>
              {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0.5 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  fullWidth
                  required
                />
                <FormControl fullWidth size="small">
                  <InputLabel id="invite-role-label">Role</InputLabel>
                  <Select
                    labelId="invite-role-label"
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "admin" | "member")}
                  >
                    <MenuItem value="member">Member — read-only access</MenuItem>
                    <MenuItem value="admin">Admin — can manage members</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button color="inherit" onClick={close} disabled={submitting}>Cancel</Button>
              <Button variant="contained" onClick={() => void submit()} loading={submitting}>
                Send invite
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
