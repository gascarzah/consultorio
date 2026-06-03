import Swal from "sweetalert2";
import { SWEET_ELIMINO, SWEET_SUCESS } from "./Constants";

export const SweetCrud = (title, iconOrMessage, text) => {
    const validIcons = new Set(["success", "error", "warning", "info", "question"]);
    const isValidIcon = validIcons.has(iconOrMessage);

    Swal.fire({
        title: isValidIcon ? `Se ${title} exitosamente` : (title || "Error"),
        text: isValidIcon ? text : (iconOrMessage || text),
        icon: isValidIcon ? iconOrMessage : "error",
        confirmButtonColor: "#0ea5e9"
      });
}

export const SweetDelete = (id, processDelete) => {
  Swal.fire({
    title: "Estas seguro de eliminarlo?",
    text: "Luego no se podra recuperar",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0ea5e9",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si"
  }).then((result) => {
      if (result.isConfirmed) {
        processDelete(id)
        SweetCrud(SWEET_ELIMINO, SWEET_SUCESS)
      }
  });
}