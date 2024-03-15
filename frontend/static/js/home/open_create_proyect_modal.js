const btn_open = document.querySelector("#nuevo_proyecto_btn");
const btn = document.querySelector(".btn_close_create_proyect_modal");
const modal_create_proyect = document.querySelector(".main_modal_crear");

btn.addEventListener("click", () => {
  modal_create_proyect.style.display = "none";
});

const open_modal_create_proyect = (modal) => {
  return (modal.style.display = "flex");
};
btn_open.addEventListener("click", () => {
  open_modal_create_proyect(modal_create_proyect);
});
// open_modal_create_proyect(modal_create_proyect)
