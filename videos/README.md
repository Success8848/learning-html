# Traffic video input

Place demo or camera recordings in this folder. Keep the video id in the filename, for example:

```text
RED_01.mp4
```

Detection timestamps are supplied separately to the backend processor. For example, processing
`RED_01` at `00:12` creates the evidence reference `RED_01_00-12.jpg` and publishes one incident
with the same camera, violation, timestamp, severity, and evidence id.

The folder is intentionally empty of media in source control so large video files are not bundled
with the application.
