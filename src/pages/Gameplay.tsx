const Gameplay = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">Gameplay</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Core Mechanics</h2>
          <div className="space-y-6">
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Dungeon Exploration</h3>
              <p className="text-dungeon-text">
                Navigate through procedurally generated dungeons, each with unique layouts, traps,
                and treasures. Use your wits and skills to overcome challenges and discover hidden
                secrets.
              </p>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Combat System</h3>
              <p className="text-dungeon-text">
                Engage in real-time combat with a variety of weapons and abilities. Master different
                combat styles and develop your own strategies to defeat challenging enemies.
              </p>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Character Progression</h3>
              <p className="text-dungeon-text">
                Level up your character, unlock new abilities, and customize your playstyle. Choose
                from different character classes and develop your character's unique strengths.
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Features</h2>
          <div className="space-y-6">
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Multiplayer</h3>
              <p className="text-dungeon-text">
                Team up with friends or join forces with other players to tackle challenging dungeons
                together. Coordinate strategies and combine abilities for maximum effectiveness.
              </p>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Crafting System</h3>
              <p className="text-dungeon-text">
                Collect resources and craft powerful items, weapons, and armor. Experiment with
                different combinations to create unique equipment tailored to your playstyle.
              </p>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Dynamic Events</h3>
              <p className="text-dungeon-text">
                Experience special events and challenges that change the game world. Participate in
                limited-time activities for exclusive rewards and unique experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gameplay 