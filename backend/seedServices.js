require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const connectDB = require("./config/db");
const User = require("./models/User");
const Provider = require("./models/Provider");
const Category = require("./models/Category");

const services = [
    {
        name: "Professional Makeup Artist",
        person: "Ananya Singh",
        category: "Beauty",
        price: 1200,
        location: "South Delhi",
        description: "Makeup services for parties, events and special occasions."
    },
    {
        name: "Wedding Photographer",
        person: "Arjun Mehta",
        category: "Photography",
        price: 3500,
        location: "South Delhi",
        description: "Wedding, portrait and event photography."
    },
    {
        name: "Electrical Repair Expert",
        person: "Mohit Kumar",
        category: "Repairs",
        price: 600,
        location: "West Delhi",
        description: "Electrical installation, maintenance and repairs."
    },
    {
        name: "Deep Cleaning Services",
        person: "Neha Gupta",
        category: "Cleaning",
        price: 1000,
        location: "North Delhi",
        description: "Detailed home and office cleaning services."
    },
    {
        name: "Interior Designer",
        person: "Riya Malhotra",
        category: "Home Services",
        price: 2500,
        location: "South Delhi",
        description: "Creative interior design and home decoration."
    },
    {
        name: "English Language Tutor",
        person: "Simran Kaur",
        category: "Education",
        price: 700,
        location: "North Delhi",
        description: "English speaking and communication classes."
    },
    {
        name: "Hair Styling Expert",
        person: "Mehak Arora",
        category: "Beauty",
        price: 900,
        location: "West Delhi",
        description: "Professional hair styling and beauty treatments."
    },
    {
        name: "Plumbing Expert",
        person: "Aman Yadav",
        category: "Plumbing",
        price: 750,
        location: "North Delhi",
        description: "Pipe fitting, leakage and plumbing repairs."
    },
    {
        name: "Furniture Craftsman",
        person: "Vikram Singh",
        category: "Crafts & Handyman",
        price: 1500,
        location: "East Delhi",
        description: "Custom furniture, woodwork and furniture repairs."
    },
    {
        name: "General Physician",
        person: "Dr. Sample Provider",
        category: "Healthcare",
        price: 500,
        location: "Central Delhi",
        description: "Sample healthcare listing. Verify credentials before choosing a provider."
    },
    {
        name: "AC Repair Specialist",
        person: "Karan Verma",
        category: "Repairs",
        price: 900,
        location: "East Delhi",
        description: "Air conditioner servicing and repair."
    },
    {
        name: "Office Cleaning Professional",
        person: "Pooja Sharma",
        category: "Cleaning",
        price: 1500,
        location: "West Delhi",
        description: "Professional office and workspace cleaning."
    },
    {
        name: "Personal Fitness Trainer",
        person: "Aarav Kapoor",
        category: "Healthcare",
        price: 1000,
        location: "South Delhi",
        description: "Personal fitness and wellness training."
    }
];

async function seedServices() {
    try {
        await connectDB();

        let added = 0;
        let skipped = 0;

        for (const service of services) {

            const existing = await Provider.findOne({
                serviceName: service.name
            });

            if (existing) {
                console.log("Already exists:", service.name);
                skipped++;
                continue;
            }

            const category = await Category.findOne({
                name: service.category,
                isActive: true
            });

            if (!category) {
                throw new Error(
                    `Category not found: ${service.category}`
                );
            }

            const slug = service.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, ".");

            const email = `demo.${slug}@localloop.test`;

            let user = await User.findOne({ email });

            if (!user) {
                const randomPassword = crypto
                    .randomBytes(24)
                    .toString("hex");

                const hashedPassword = await bcrypt.hash(
                    randomPassword,
                    10
                );

                user = await User.create({
                    name: service.person,
                    email,
                    password: hashedPassword,
                    role: "provider"
                });
            }

            await Provider.create({
                userId: user._id,
                serviceName: service.name,
                category: category._id,
                description: service.description,
                experience: 0,
                price: service.price,
                location: service.location,
                contact: "Not available (demo listing)"
            });

            console.log("Added:", service.name);
            added++;
        }

        console.log("\n========== COMPLETE ==========");
        console.log("Added:", added);
        console.log("Skipped:", skipped);

        const total = await Provider.countDocuments();
        console.log("Total provider listings:", total);

    } catch (error) {
        console.error("Seeding failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedServices();