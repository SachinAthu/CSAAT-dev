from django.urls import path

from .views import *

urlpatterns = [
    path('', welcome, name='welcome'),


    path('t-children/', tChildren, name='t-children'),
    path('t-f-children/', TypicalChildrenListAPIView.as_view(), name='t-f-children'),
    path('t-child/<int:pk>/', tChild, name='t-child'),
    path('add-t-child/', addTChild, name='add-t-child'),
    path('update-t-child/<int:pk>/', updateTChild, name='update-t-child'),
    path('delete-t-child/<int:pk>/', deleteTChild, name='delete-t-child'),
    path('delete-t-children/', deleteTChildren, name='delete-t-children'),


    path('at-children/', atChildren, name='t-children'),
    path('at-f-children/', AntypicalChildrenListAPIView.as_view(), name='at-f-children'),
    path('at-child/<int:pk>/', atChild, name='at-child'),
    path('add-at-child/', addATChild, name='add-at-child'),
    path('update-at-child/<int:pk>/', updateATChild, name='update-at-child'),
    path('delete-at-child/<int:pk>/', deleteATChild, name='delete-at-child'),
    path('delete-at-children/', deleteATChildren, name='delete-at-children'),


    path('sessions/', allSessions, name='all-sessions'),
    path('session/<int:pk>/', session, name='session'),
    path('t-sessions/<int:pk>/', tSessions, name='t-sessions'),
    path('at-sessions/<int:pk>/', atSessions, name='at-sessions'),
    path('add-t-session/', addTSession, name='add-t-session'),
    path('add-at-session/', addATSession, name='add-at-session'),
    path('update-session/<int:pk>/', updateSession, name='update-session'),
    path('delete-session/<int:pk>/', deleteSession, name='delete-session'),


    path('t-videos/', allTVideos, name='t-videos'),
    path('at-videos/', allATVideos, name='at-videos'),

    path('videos/<int:pk>/', sessionVideos, name='session-videos'),
    
    path('t-s-videos/', allTSlicedVideos, name='t-s-videos'),
    path('at-s-videos/', allATSlicedVideos, name='at-s-videos'),
    
    path('t-us-videos/', allTUnslicedVideos, name='t-us-videos'),
    path('at-us-videos/', allATUnslicedVideos, name='at-us-videos'),

    path('t-f-videos/', AllTVideosListAPIView.as_view(), name='t-f-videos'),
    path('t-s-f-videos/', SlicedTVideosListAPIView.as_view(), name='t-s-f-videos'),
    path('t-us-f-videos/', UnslicedTVideosListAPIView.as_view(), name='t-us-f-videos'),
    path('at-f-videos/', AllATVideosListAPIView.as_view(), name='at-f-videos'),
    path('at-s-f-videos/', SlicedATVideosListAPIView.as_view(), name='at-s-f-videos'),
    path('at-us-f-videos/', UnslicedATVideosListAPIView.as_view(), name='at-us-f-videos'),

    path('video-info/<int:pk>/', getVideoInfo, name='video-info'),
    path('video/<int:pk>/', getVideo, name='video'),

    path('add-t-video/', addTVideo, name='add-t-video'),
    path('add-at-video/', addATVideo, name='add-at-video'),
    path('update-video/<int:pk>/', updateVideo, name='update-video'),
    path('delete-video/<int:pk>/', deleteVideo, name='delete-video'),
    path('delete-videos/', deleteVideos, name='delete-videos'),


    path('audios/', allAudios, name='audios'),
    path('audio/<int:pk>/', sessionAudio, name='session-audio'),
    path('add-t-audio/', addTAudio, name='add-t-audio'),
    path('add-at-audio/', addATAudio, name='add-at-audio'),
    path('delete-audio/<int:pk>/', deleteAudio, name='delete-audio'),
    path('delete-audios/', deleteAudios, name='delete-audios'),


    path('video-clips/', allVideoClips, name='all-video-clips'),
    path('video-clip/<int:pk>/', videoClip, name='video-clip'),
    path('single-video-clip/<int:pk>/', singleVideoClip, name='single-video-clip'),
    path('add-video-clip/', addVideoClip, name='add-video-clip'),
    path('delete-video-clip/<int:pk>/', deleteVideoClip, name='delete-video-clip'),
    path('delete-video-clips/', deleteVideoClips, name='delete-video-clips'),


    path('cameras/', cameras, name='cameras'),
    path('f-cameras/', CamerasListAPIView.as_view(), name='f-cameras'),
    path('camera/<int:pk>/', camera, name='camera'),
    path('add-camera/', addCamera, name='add-camera'),
    path('delete-camera/<int:pk>/', deleteCamera, name='delete-camera'),
    path('delete-cameras/', deleteCameras, name='delete-cameras'),


    path('camera-angles/', cameraAngles, name='camera-angles'),
    path('f-camera-angles/', CameraAnglesListAPIView.as_view(), name='f-camera-angles'),
    path('camera-angle/<int:pk>', cameraAngle, name='camera-angle'),
    path('add-camera-angle/', addCameraAngle, name='add-camera-angle'),
    path('delete-camera-angle/<int:pk>/', deleteCameraAngle, name='delete-camera-angle'),
    path('delete-camera-angles/', deleteCameraAngles, name='delete-camera-angles'),
]