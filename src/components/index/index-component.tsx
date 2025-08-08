"use client"

import { useEntityStore } from "@/lib/application-utils";

export default function IndexComponent() {

    const entity = useEntityStore((state) => state.entity);

    return (
        <div>
            <h1>{entity}</h1>
        </div>
    )
}