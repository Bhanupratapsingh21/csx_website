"use client";

import { Carousel, Column } from "@once-ui-system/core";

interface VideoItem {
    youtubeId: string;
    title: string;
}

const VIDEOS: VideoItem[] = [
    {
        youtubeId: "sU3VOLxnDRk",
        title: "CS Explained Video 2"
    },
    {
        youtubeId: "9ot69YBIu88",
        title: "CS Explained Video 1"
    },

    {
        youtubeId: "hnNxJ2Kvbv8",
        title: "CS Explained Video 3"
    },
    {
        youtubeId: "X8u_tggIWS4",
        title: "CS Explained Video 4"
    },
    {
        youtubeId: "yY4rq6qIaB0",
        title: "CS Explained Video 5"
    }
    // Add more videos as needed
];

export function VideoCarousel() {
    return (
        <Column fillWidth paddingX="l">
            <Carousel
                sizes="(max-width: 960px) 100vw, 960px"
                items={VIDEOS.map(video => ({
                    slide: (
                        <div style={{ width: "100%", height: "100%" }} className="w-full h-full aspect-video">
                            <iframe
                                style={{ width: "100%", height: "100%" }}
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ),
                    alt: video.title
                }))}
            />
        </Column>
    );
}