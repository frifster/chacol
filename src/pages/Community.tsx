const Community = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">Community</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Join the Adventure</h2>
          <p className="text-dungeon-text mb-6">
            Connect with fellow adventurers, share strategies, and discuss your experiences in the world of Chacol.
            Our community is a welcoming space for all players, from beginners to seasoned dungeon crawlers.
          </p>
          <div className="space-y-4">
            <a href="#" className="btn-primary block text-center">Join Discord</a>
            <a href="#" className="btn-primary block text-center bg-opacity-50">Visit Forums</a>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Community Highlights</h2>
          <div className="space-y-4">
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Fan Art Gallery</h3>
              <p className="text-dungeon-text">View and share amazing fan-created artwork inspired by Chacol.</p>
            </div>
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Strategy Guides</h3>
              <p className="text-dungeon-text">Learn from experienced players and share your own strategies.</p>
            </div>
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Modding Community</h3>
              <p className="text-dungeon-text">Discover and create custom content for Chacol.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community 