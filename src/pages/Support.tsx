const Support = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">FAQ</h2>
          <div className="space-y-4">
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">How do I install the game?</h3>
              <p className="text-dungeon-text">
                Visit our Download page and follow the installation instructions for your
                operating system.
              </p>
            </div>
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">What are the system requirements?</h3>
              <p className="text-dungeon-text">
                Check the Download page for detailed system requirements for your platform.
              </p>
            </div>
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">How do I report a bug?</h3>
              <p className="text-dungeon-text">
                Use our bug reporting form or join our Discord community to report issues.
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Contact Us</h2>
          <div className="bg-dungeon-light p-6 rounded-lg">
            <form className="space-y-4">
              <div>
                <label className="block text-dungeon-text mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-dungeon-dark text-dungeon-text rounded-md"
                />
              </div>
              <div>
                <label className="block text-dungeon-text mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-dungeon-dark text-dungeon-text rounded-md"
                />
              </div>
              <div>
                <label className="block text-dungeon-text mb-2">Subject</label>
                <select className="w-full px-4 py-2 bg-dungeon-dark text-dungeon-text rounded-md">
                  <option>Technical Support</option>
                  <option>Account Issues</option>
                  <option>Billing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-dungeon-text mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-dungeon-dark text-dungeon-text rounded-md"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Community Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" className="bg-dungeon-light p-4 rounded-lg text-center">
            <h3 className="text-xl text-dungeon-accent mb-2">Discord</h3>
            <p className="text-dungeon-text">Join our community for real-time support</p>
          </a>
          <a href="#" className="bg-dungeon-light p-4 rounded-lg text-center">
            <h3 className="text-xl text-dungeon-accent mb-2">Forums</h3>
            <p className="text-dungeon-text">Browse our knowledge base and discussions</p>
          </a>
          <a href="#" className="bg-dungeon-light p-4 rounded-lg text-center">
            <h3 className="text-xl text-dungeon-accent mb-2">Documentation</h3>
            <p className="text-dungeon-text">Access our comprehensive guides and tutorials</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Support 