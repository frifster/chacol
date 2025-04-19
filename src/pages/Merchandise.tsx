const Merchandise = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">Merchandise</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-dungeon-light p-6 rounded-lg">
          <div className="aspect-square bg-dungeon-dark rounded-lg mb-4"></div>
          <h3 className="text-xl text-dungeon-accent mb-2">Chacol T-Shirt</h3>
          <p className="text-dungeon-text mb-4">Show your love for Chacol with this stylish t-shirt featuring the game's logo.</p>
          <p className="text-dungeon-accent text-lg mb-4">$29.99</p>
          <button className="btn-primary w-full">Add to Cart</button>
        </div>
        <div className="bg-dungeon-light p-6 rounded-lg">
          <div className="aspect-square bg-dungeon-dark rounded-lg mb-4"></div>
          <h3 className="text-xl text-dungeon-accent mb-2">Dungeon Map Poster</h3>
          <p className="text-dungeon-text mb-4">A detailed poster featuring the iconic dungeons of Chacol.</p>
          <p className="text-dungeon-accent text-lg mb-4">$19.99</p>
          <button className="btn-primary w-full">Add to Cart</button>
        </div>
        <div className="bg-dungeon-light p-6 rounded-lg">
          <div className="aspect-square bg-dungeon-dark rounded-lg mb-4"></div>
          <h3 className="text-xl text-dungeon-accent mb-2">Collector's Edition</h3>
          <p className="text-dungeon-text mb-4">Limited edition box set including art book, soundtrack, and exclusive in-game items.</p>
          <p className="text-dungeon-accent text-lg mb-4">$99.99</p>
          <button className="btn-primary w-full">Add to Cart</button>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">Shipping Information</h2>
        <div className="bg-dungeon-light p-6 rounded-lg">
          <p className="text-dungeon-text mb-4">
            We ship worldwide! Standard shipping takes 5-7 business days. Express shipping available
            for an additional fee.
          </p>
          <p className="text-dungeon-text">
            All orders include tracking information and are carefully packaged to ensure your
            merchandise arrives in perfect condition.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Merchandise 