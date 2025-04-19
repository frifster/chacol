const Events = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Dungeon Master Tournament</h3>
              <p className="text-dungeon-text mb-2">March 15, 2024</p>
              <p className="text-dungeon-text mb-4">
                Compete against the best dungeon masters in a series of challenging dungeons.
                Prizes include exclusive in-game items and real-world merchandise.
              </p>
              <a href="#" className="btn-primary">Register Now</a>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Community Stream</h3>
              <p className="text-dungeon-text mb-2">March 20, 2024</p>
              <p className="text-dungeon-text mb-4">
                Join our developers for a live stream showcasing upcoming features and answering
                community questions.
              </p>
              <a href="#" className="btn-primary">Set Reminder</a>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Past Events</h2>
          <div className="space-y-4">
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Winter Festival</h3>
              <p className="text-dungeon-text mb-2">December 2023</p>
              <p className="text-dungeon-text">
                A special holiday event featuring unique dungeons, seasonal rewards, and community
                activities.
              </p>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Launch Celebration</h3>
              <p className="text-dungeon-text mb-2">October 2023</p>
              <p className="text-dungeon-text">
                The official launch of Chacol, featuring special events, giveaways, and community
                celebrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events 