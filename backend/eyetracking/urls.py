#url.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path 
from .views.linea_graph import graph_data
from .views.projects import list_projects,abrir_proyecto,crear_proyecto
from .views.subir_archivos import subir_archivos
from .views.login import validar_usuario,login
from .views.grafic_interes import graph_interes_data 
from .views.grafic_impacto import graph_impacto_data 
from . import vista
from .views.profile import actualizar_usuario
from .views.crear_usu import crear_usuario


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', vista.index, name='index'),
    path('/convert_to_csv/', vista.convert_to_csv, name='convert_to_csv'),  # Asegúrate de tener la barra al final#
    path('load_file', vista.load_file, name='load_file'),
    path('login/', login, name='login'),
    path('validar_usuario', validar_usuario, name='validar_usuario'),
    path('homepage', vista.homepage, name='homepage'),
    path('list-projects/', list_projects, name='list_projects'), #configuracion necesaria para la plantilla
    path('graph_data/', graph_data, name="graph_data"),
    path('graph_data/<int:recording_name>/', graph_data, name="graph_data_with_name"),
    path('graph_interes_data/', graph_interes_data, name="graph_interes_data"),
    path('graph_impacto_data/', graph_impacto_data, name="graph_mpacto_data"),
    path('actualizar_usuario/', actualizar_usuario, name="actualizar_usuario"),
    path('crear_usuario/', crear_usuario, name="crear_usuario"),

    path('abrir-proyecto/<int:proyecto_id>/', abrir_proyecto, name='abrir_proyecto'), # recibe el id del controlador list_projects.js
     re_path(r'^media/(?P<path>.*)$', vista.serve_media),  # para manejar las solicitudes de archivos estáticos o medios
      path('crear_proyecto/', crear_proyecto, name='crear_proyecto'),
      path('subir_archivos/', subir_archivos, name='subir_archivos'),
]

# Esta línea debería ir al final de tu archivo urls.py
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
