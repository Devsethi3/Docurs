import React from "react";
import { motion } from "framer-motion";

const featuresList = [
  {
    icon: "💡",
    title: "Smart Automation",
    description:
      "Automate repetitive tasks with our intelligent AI assistants that learn and adapt to your workflow.",
  },
  {
    icon: "📊",
    title: "Data Analytics",
    description:
      "Transform raw data into actionable insights with powerful AI-driven analytics tools.",
  },
  {
    icon: "🔍",
    title: "Predictive Intelligence",
    description:
      "Leverage machine learning algorithms to anticipate trends and make smarter business decisions.",
  },
  {
    icon: "🔄",
    title: "Seamless Integration",
    description:
      "Easily connect with your existing tools through our extensive API and integration ecosystem.",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    description:
      "Rest easy with bank-level encryption and comprehensive security protocols protecting your data.",
  },
  {
    icon: "🚀",
    title: "Scalable Solutions",
    description:
      "Our platform grows with your business, from startups to enterprise-level operations.",
  },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section id="features" className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-primary font-medium mb-4"
          >
            Our Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Powerful AI Tools to Transform Your Business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            Our platform offers a comprehensive suite of AI-powered features designed to 
            streamline your operations and drive growth.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-muted/20"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-colors">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;