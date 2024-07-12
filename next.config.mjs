/** @type {import('next').NextConfig} */
const nextConfig = {
     images:{
          remotePatterns:[
               {
                    protocol:'https', 
                    hostname:'cheery-kangaroo-448.convex.cloud', 
                    pathname: '**', 
                },
          ]

     }
};

export default nextConfig;
