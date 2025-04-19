const Download = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">Download Chacol</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">System Requirements</h2>
          <div className="bg-dungeon-light p-6 rounded-lg mb-8">
            <h3 className="text-xl text-dungeon-accent mb-4">Minimum Requirements</h3>
            <ul className="space-y-2 text-dungeon-text">
              <li>• OS: Windows 10, macOS 10.15, or Linux</li>
              <li>• Processor: Intel Core i5 or equivalent</li>
              <li>• Memory: 8 GB RAM</li>
              <li>• Graphics: NVIDIA GTX 1060 or equivalent</li>
              <li>• Storage: 10 GB available space</li>
            </ul>
          </div>
          <div className="bg-dungeon-light p-6 rounded-lg">
            <h3 className="text-xl text-dungeon-accent mb-4">Recommended Requirements</h3>
            <ul className="space-y-2 text-dungeon-text">
              <li>• OS: Windows 11, macOS 12, or Linux</li>
              <li>• Processor: Intel Core i7 or equivalent</li>
              <li>• Memory: 16 GB RAM</li>
              <li>• Graphics: NVIDIA RTX 2060 or equivalent</li>
              <li>• Storage: 10 GB available space</li>
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Download Options</h2>
          <div className="space-y-4">
            <a href="#" className="btn-primary block text-center">
              Download for Windows
            </a>
            <a href="#" className="btn-primary block text-center">
              Download for macOS
            </a>
            <a href="#" className="btn-primary block text-center">
              Download for Linux
            </a>
          </div>
          <div className="mt-8">
            <h3 className="text-xl text-dungeon-accent mb-4">Installation Guide</h3>
            <ol className="list-decimal list-inside space-y-2 text-dungeon-text">
              <li>Download the appropriate version for your operating system</li>
              <li>Run the installer and follow the on-screen instructions</li>
              <li>Launch Chacol from your desktop or start menu</li>
              <li>Create an account or log in to your existing account</li>
              <li>Begin your adventure!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Download 