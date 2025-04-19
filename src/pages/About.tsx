const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">About Chacol</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">The Story</h2>
          <p className="text-dungeon-text mb-6">
            Chacol: The Dungeon Chronicles is an immersive 3D dungeon crawler that takes you on an epic journey
            through mysterious and treacherous dungeons. Uncover ancient secrets, battle formidable foes,
            and discover the truth behind the legend of Chacol.
          </p>
          <p className="text-dungeon-text">
            Our team of passionate developers and artists have crafted a unique gaming experience that
            combines classic dungeon crawler mechanics with modern 3D graphics and innovative gameplay
            features.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Development</h2>
          <p className="text-dungeon-text mb-6">
            Built using cutting-edge technologies like Three.js and React, Chacol pushes the boundaries
            of what's possible in browser-based gaming. Our commitment to quality and player experience
            drives every aspect of development.
          </p>
          <p className="text-dungeon-text">
            Join us on this exciting journey as we continue to expand and improve the world of Chacol,
            adding new features, dungeons, and challenges for players to explore.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About 