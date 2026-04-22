export default function SummaryCard({ title, value }) {
  return (
    <Card
      sx={{
        width: "100%",
        flexGrow: 1, 
        display: "flex",
        alignItems: "center"
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}