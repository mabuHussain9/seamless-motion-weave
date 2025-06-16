
export const FREE_MODE_LIMITS = {
  maxImages: 200,
  maxFramesPerImage: 24,
  maxTotalFrames: 4800, // 200 * 24
  processingTimeout: 300000, // 5 minutes
};

export const PREMIUM_MODE_LIMITS = {
  maxImages: 1000,
  maxFramesPerImage: 60,
  maxTotalFrames: 60000,
  processingTimeout: 600000, // 10 minutes
};

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per image

export const DEFAULT_FRAME_RATE = 30; // fps
export const MIN_FRAME_RATE = 1;
export const MAX_FRAME_RATE = 60;
