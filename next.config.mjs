/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Izinkan gambar dari URL eksternal apa pun (konten dikelola dari DB).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
