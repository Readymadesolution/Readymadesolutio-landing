"use client";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ConstructionOutlined from "@mui/icons-material/ConstructionOutlined";

export default function ComingSoon({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderStyle: "dashed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        px: 3,
        py: 10,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: 48,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          bgcolor: "primary.light",
          color: "primary.dark",
        }}
      >
        <ConstructionOutlined />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
        {title}
      </Typography>
      <Typography sx={{ maxWidth: 360, fontSize: 13.5, color: "text.secondary" }}>
        {note}
      </Typography>
    </Card>
  );
}
