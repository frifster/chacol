const News = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">News & Updates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Latest News</h2>
          <div className="space-y-6">
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Major Update 1.2 Released</h3>
              <p className="text-dungeon-text mb-2">March 1, 2024</p>
              <p className="text-dungeon-text mb-4">
                Introducing new dungeons, character classes, and quality-of-life improvements.
                Check out the patch notes for all the details!
              </p>
              <a href="#" className="btn-primary">Read More</a>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Community Spotlight</h3>
              <p className="text-dungeon-text mb-2">February 25, 2024</p>
              <p className="text-dungeon-text mb-4">
                Meet our featured community members and their amazing contributions to the
                Chacol universe.
              </p>
              <a href="#" className="btn-primary">Read More</a>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Developer Blog</h2>
          <div className="space-y-6">
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Behind the Scenes</h3>
              <p className="text-dungeon-text mb-2">February 20, 2024</p>
              <p className="text-dungeon-text mb-4">
                A look at the development process and the challenges of creating immersive
                3D dungeons.
              </p>
              <a href="#" className="btn-primary">Read More</a>
            </div>
            <div className="bg-dungeon-light p-6 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Future Plans</h3>
              <p className="text-dungeon-text mb-2">February 15, 2024</p>
              <p className="text-dungeon-text mb-4">
                Sneak peek at upcoming features and content planned for the next few months.
              </p>
              <a href="#" className="btn-primary">Read More</a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Subscribe to Newsletter</h2>
        <div className="bg-dungeon-light p-6 rounded-lg max-w-md">
          <p className="text-dungeon-text mb-4">
            Stay updated with the latest news, updates, and exclusive content by subscribing
            to our newsletter.
          </p>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-dungeon-dark text-dungeon-text rounded-md"
            />
            <button type="submit" className="btn-primary w-full">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default News 