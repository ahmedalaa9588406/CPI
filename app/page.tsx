import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata:Metadata={
  title:"Welcome",
  icons: 'parrot.svg'
}

export default function WelcomePage() {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row gap-12 m-8">
        
        <div className="flex justify-center ">
          <Image 
          src="/assets/pngtree-modern-black-city-icon-vector-png-png-image_5709711.png" 
          className="w-48 h-48 sm:w-64 sm:h-64 md:w-128 md:h-128" 
          alt="city icon" 
          width={200} 
          height={200}
          
          />
        </div>
        
        <div className="flex flex-col justify-around gap-6">
          <h1 className="text-lg sm:text-xl md:text-4xl font-jura font-bold">City Prosperity Index</h1>
          <div className="">
            <Link href="/home" className="flex justify-center">
              <Button variant="outline" className="w-3/4 sm:w-2/3 rounded-full border-none text-lg sm:text-xl">Let&apos;s start</Button>
            </Link>
            
          </div>
        </div>

      </div>
    </main>
  );
}