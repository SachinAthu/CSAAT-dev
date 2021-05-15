from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('video-uploader', TemplateView.as_view(template_name='videoUploaderIndex.html')),
    path('video-slicer', TemplateView.as_view(template_name='videoSlicerIndex.html'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
