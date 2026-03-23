import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      
      {/* Call to Action Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl rounded-3xl bg-primary/10 border border-primary/20 dark:bg-primary/5 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Ready to Scale Your Brand?</h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Join thousands of brands and influencers who are already connecting and growing on Monetize Connect.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
              Get Started Now
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-zinc-800 text-foreground font-bold rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer-like section */}
      <footer className="py-12 border-t border-zinc-100 dark:border-white/5 text-center">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Monetize Connect. Made for the Creator Economy.
        </p>
      </footer>
    </div>
  );
}
