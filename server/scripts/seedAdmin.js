import bcrypt from 'bcryptjs';
import { db } from '../src/models/database.js';
import { users } from '../src/models/schema.js';

const seedAdminUser = async () => {
  try {
    console.log('🌱 Creating admin user...');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    await db.insert(users).values({
      email: 'admin@inventory.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@inventory.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdminUser();
