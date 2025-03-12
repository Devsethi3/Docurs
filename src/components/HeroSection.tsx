import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              AI-Powered SaaS Platform
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Transform Your Workflow With{" "}
              <span className="text-primary">Advanced AI</span> Tools
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Streamline your processes, boost productivity, and unlock new
              insights with our cutting-edge AI solutions designed for modern
              businesses.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-colors">
                Get Started
              </button>
              <button className="border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-full font-medium transition-colors">
                Watch Demo
              </button>
            </motion.div>
            <motion.div
              className="mt-8 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium">Trusted by 10,000+</div>
                <div className="text-xs text-muted-foreground">
                  teams worldwide
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-1"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-background rounded-xl overflow-hidden shadow-2xl">
                  <div className="h-12 bg-muted flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-4 bg-muted/20 p-4 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        U
                      </div>
                      <div className="flex-1">
                        <div className="h-4 w-1/3 bg-muted rounded mb-2"></div>
                        <div className="h-4 w-5/6 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-start gap-4 bg-muted/20 p-4 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="h-4 w-2/3 bg-muted rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 relative">
                      <input
                        type="text"
                        placeholder="Ask something..."
                        className="w-full bg-muted/30 border border-muted rounded-lg py-3 px-4"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
