// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       domains: ['firebasestorage.googleapis.com'],    },
//   };
  
//   export default nextConfig;
  /////

  /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    turbotrace: {
      logLevel: 'error',
      logDetail: true,
    },
  },
};

export default nextConfig;