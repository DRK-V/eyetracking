const seccion_graficos = document.querySelector("#view_graph");
const view_upload_files = document.querySelector("#view_upload_files");
const filter_menu = document.querySelector("#filter_menu");
// const modal_videos = document.querySelector('#blur_modal_videos')
const modal_reportes = document.querySelector("#modal_reportes");
const modal_videos = document.querySelector("#videos_modal");
const btn_close_filter_menu = document.querySelector("#btn_close_filters_menu");
const main_modal_crear = document.querySelector(".main_modal_crear");

const btn_close_modal_videos = document.querySelector(
  "#close_modal_videos>svg"
);

//contante de perfil
let profile;
let crear_usuario;
document.addEventListener("DOMContentLoaded", function () {
  profile = document.querySelector("#profile_sesion");
  crear_usuario = document.querySelector("#crear_usuario");
  console.log(profile);
  console.log(crear_usuario);
});

// btn_close_modal_videos.addEventListener("click", () => {
//   modal_videos.style.display = "none";
// });

btn_close_filter_menu.addEventListener(
  "click",
  () => (filter_menu.style.display = "none")
); //evento cerrar menu

const open_section = (section) => {
  section.style.display = "flex";
};

const close_section = (section) => {
  section.style.display = "none";
};

document.addEventListener("DOMContentLoaded", function () {
  // Obtén todos los elementos con la clase 'menu-option'
  const menuOptions = document.querySelectorAll(".menu-option");
  // console.log(menuOptions);
  // Agrega un evento de clic a cada enlace del menú
  menuOptions.forEach(function (menuOption) {
    menuOption.addEventListener("click", function (event) {
      // Obtiene el id del elemento clicado y lo imprime en la consola
      const clickedId = menuOption.id;
      // console.log('Elemento clicado con id:', clickedId);

      // Evita el comportamiento predeterminado del enlace
      event.preventDefault();

      // Obtiene el valor del atributo data-target
      const target = menuOption.getAttribute("data-target");
      // console.log('target:', target);

      // Oculta todos los componentes excepto el especificado
      hideAllComponents(target);
      // Muestra el componente correspondiente
      showComponent(target);
    });
  });

  // Función para ocultar todos los componentes excepto el especificado
  function hideAllComponents(target) {
    if (target !== "filtros") {
      // console.log('ocultando todos excepto:', target);
      const components = document.querySelectorAll(".main-content > div");
      components.forEach(function (component) {
        // console.log('id: ', component.id)
        if (component.id !== target) {
          close_section(component);
        }
      });
    }

    if (target === "graficos") {
      if (filter_menu.style.display === "flex") {
        open_section(filter_menu);
      } else {
        close_section(filter_menu);
      }
    } else {
      close_section(filter_menu);
    }
  }

  // Función para mostrar un componente específico
  function showComponent(componentId) {
    const component = document.querySelector(componentId);
    switch (componentId) {
      case "graficos":
        open_section(seccion_graficos);
        break;
      case "cargar_archivos":
        open_section(view_upload_files);
        break;
      // case 'videos': open_section(view_upload_files); break;
      case "filtros":
        open_section(filter_menu);
        break;
      case "videos":
        open_section(modal_videos);
        break;
      case "reportes":
        open_section(modal_reportes);
        break;
      //componente de opciones de usuario
      case "profile_option":
        open_section(profile);
        break;
      //este es para crear usuarios
      case "crear_usuario":
        open_section(crear_usuario);
        break;
      // Agrega más casos según tus necesidades
    }
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "f" || e.key === "F") {
    if (filter_menu.style.display === "none") {
      // validar que las vistas de ingreso de datos no se encuentren activas
      if (seccion_graficos.style.display !== "none") {
        if (main_modal_crear.style.display !== "flex") {
          open_section(filter_menu);
        }
      } else {
        console.log("the F key is enabled to write");
      }
    } else {
      close_section(filter_menu);
    }
  }
});
