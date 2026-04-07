import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">About Web3 Fighter</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome to Web3 Fighter</h2>
        <p className="text-gray-700">
          Web3 Fighter is a next-generation fighter game built with Three.js that
          brings your characters to life in stunning 3D. Train, battle, and evolve
          your fighters in a fully interactive world where every move and skill is
          tokenized and tradable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
        <p className="text-gray-700">
          Create your unique fighter and train them to gain new skills and abilities.
          Each move is represented as a unique digital asset, allowing you to trade
          and strategize like never before. Enter the arena and test your fighter
          against others in real-time battles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>3D fighter creation and customization with Three.js</li>
          <li>Train your fighter to unlock new moves and abilities</li>
          <li>Trade moves and fighters using Web3 tokens</li>
          <li>Compete in PvP battles with other players worldwide</li>
          <li>Unique, tradable assets for each fighter move</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Web3 Integration</h2>
        <p className="text-gray-700">
          Web3 Fighter leverages blockchain technology to give players true ownership
          of their fighters and moves. Trade securely, prove the rarity of your
          fighters, and take part in a decentralized gaming ecosystem where your
          achievements are yours to keep.
        </p>
      </section>

      <section className="text-center mt-12">
        <p className="text-gray-600">
          Join the revolution in 3D blockchain gaming — train, fight, and trade your
          way to becoming a Web3 Champion!
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
