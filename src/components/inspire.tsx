"use client"
import { useEffect } from 'react';
import React from "react";
import {
    Heading,
    Flex,
    Text,
    Button,
    Avatar,
    RevealFx,
    Column,
    Badge,
    Row,
    Meta,
    Schema
} from "@once-ui-system/core";

const PeopleWhoInspiredMe = () => {
    useEffect(() => {
        // Load Twitter widgets script
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        document.body.appendChild(script);


    }, []);

    const tweetUrls = [
        "https://twitter.com/ManWithCodes/status/1949883422777967086", // Hitesh Sir
        "https://twitter.com/ManWithCodes/status/1952411599668457545", // Harkirat Singh
        "https://twitter.com/ManWithCodes/status/1950265376299741353", // Manu Paaji
        "https://twitter.com/ManWithCodes/status/1925334185830666574", // Last tweet
    ];

    return (
        <Column fillWidth gap="24" className="relative py-12">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-brand-weak/5 to-transparent" />

            <RevealFx>

                <section className="py-12 bg-gray-100">

                    <Heading
                        as="h2"
                        variant="display-strong-xs"
                        wrap="balance"
                        className="text-center"
                    >
                        People Who Inspired Me
                    </Heading>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexShrink: 0,
                            width: "100%", // max-w-6xl = 72rem
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            paddingLeft: '1rem', // px-4 = 1rem
                            paddingRight: '1rem' // px-4 = 1rem
                        }}
                    >
                        {tweetUrls.map((tweetUrl, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
                            >
                                <blockquote className="twitter-tweet w-full h-full">
                                    <a href={tweetUrl}></a>
                                </blockquote>
                            </div>
                        ))}
                    </div>


                    <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
                </section>
            </RevealFx>
        </Column>
    );
};

export default PeopleWhoInspiredMe;