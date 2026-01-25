import {ImageLoaderConfig} from "@angular/common";

export function passThroughLoader(config: ImageLoaderConfig): string {
    return config.src;
}