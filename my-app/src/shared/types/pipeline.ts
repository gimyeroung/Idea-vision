export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type DetectedObject = {
    id: string;
    label: string;
    confidence?: number;
    boundingBox?: BoundingBox;
};
