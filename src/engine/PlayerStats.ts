export class PlayerStats {
    private health: number = 100;
    private maxHealth: number = 100;
    private stamina: number = 100;
    private maxStamina: number = 100;
    private mana: number = 100;
    private maxMana: number = 100;
    private level: number = 1;
    private experience: number = 0;
    private experienceToNextLevel: number = 100;

    constructor() {}

    public update(deltaTime: number): void {
        // Regenerate resources over time
        this.stamina = Math.min(this.maxStamina, this.stamina + 5 * deltaTime);
        this.mana = Math.min(this.maxMana, this.mana + 2 * deltaTime);
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public getStamina(): number {
        return this.stamina;
    }

    public getMaxStamina(): number {
        return this.maxStamina;
    }

    public getMana(): number {
        return this.mana;
    }

    public getMaxMana(): number {
        return this.maxMana;
    }

    public getLevel(): number {
        return this.level;
    }

    public getExperience(): number {
        return this.experience;
    }

    public getExperienceToNextLevel(): number {
        return this.experienceToNextLevel;
    }

    public takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
    }

    public heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    public useStamina(amount: number): boolean {
        if (this.stamina >= amount) {
            this.stamina -= amount;
            return true;
        }
        return false;
    }

    public useMana(amount: number): boolean {
        if (this.mana >= amount) {
            this.mana -= amount;
            return true;
        }
        return false;
    }

    public addExperience(amount: number): void {
        this.experience += amount;
        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }

    private levelUp(): void {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // Increase max stats on level up
        this.maxHealth += 10;
        this.maxStamina += 5;
        this.maxMana += 5;
        
        // Restore stats to full
        this.health = this.maxHealth;
        this.stamina = this.maxStamina;
        this.mana = this.maxMana;
    }
} 