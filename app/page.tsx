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
    <main className="flex justify-center items-center min-h-screen animate-fadeIn relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/pxfuel.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.7)',
        }}
      />
      
      {/* Content */}
      <div className="flex flex-col md:flex-row gap-12 m-8 z-10 bg-black/40 p-8 rounded-2xl">
        <div className="flex justify-center animate-bounce-slow">
          <Image 
            src="/assets/pixelcut-export.png" 
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-128 md:h-128 transition-transform hover:scale-105" 
            alt="city icon" 
            width={200} 
            height={200}
            draggable={false}
          />
        </div>
        
        <div className="flex flex-col justify-around gap-6">
          <h1 className="text-lg sm:text-xl md:text-4xl font-jura font-bold animate-pulse text-white">AI-PAT</h1>
          <div className="">
            <Link href="/home" className="flex justify-center">
                <Button 
                variant="outline" 
                className="w-full sm:w-3/4 rounded-full border-none text-lg sm:text-xl py-6
                  transition-all duration-300 hover:scale-105 hover:shadow-lg
                  hover:bg-primary hover:text-primary-foreground
                  bg-black/40 text-white"
                >
                Let&apos;s start
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}