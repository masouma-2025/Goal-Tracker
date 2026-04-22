import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title
}) {

  return (

    <Dialog open={open} onClose={onClose}>

      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent>
        Are you sure?
      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          color="error"
          onClick={onConfirm}
        >
          Delete
        </Button>

      </DialogActions>

    </Dialog>

  );

}