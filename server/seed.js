require('dotenv').config();
const mongoose = require('mongoose');
const Donor = require('./models/Donor');
const BloodRequest = require('./models/BloodRequest');

const sampleDonors = [
  {
    fullName: 'Arun Kumar',
    email: 'arun.k@example.com',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    age: 28,
    gender: 'Male',
    city: 'Chennai',
    address: '14 Gandhi Road, Adyar',
    pincode: '600020',
    lastDonationDate: new Date('2024-08-15'),
    isAvailable: true,
    medicalNotes: 'Regular donor, no existing conditions'
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98765 12345',
    bloodGroup: 'A+',
    age: 24,
    gender: 'Female',
    city: 'Bangalore',
    address: 'Flat 302, Green Acres, Koramangala',
    pincode: '560034',
    lastDonationDate: new Date('2024-09-01'),
    isAvailable: true,
    medicalNotes: 'Hemoglobin 13.5 g/dL'
  },
  {
    fullName: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+91 91234 56789',
    bloodGroup: 'O-',
    age: 35,
    gender: 'Male',
    city: 'Mumbai',
    address: '8B Marine Drive',
    pincode: '400020',
    lastDonationDate: new Date('2024-06-20'),
    isAvailable: true,
    medicalNotes: 'Universal donor, willing for emergency alerts'
  },
  {
    fullName: 'Sneha Patel',
    email: 'sneha.p@example.com',
    phone: '+91 99887 76655',
    bloodGroup: 'B+',
    age: 29,
    gender: 'Female',
    city: 'Ahmedabad',
    address: '42 Ashram Road',
    pincode: '380009',
    lastDonationDate: new Date('2024-07-10'),
    isAvailable: true,
    medicalNotes: 'Available on weekends'
  },
  {
    fullName: 'Rahul Verma',
    email: 'rahul.v@example.com',
    phone: '+91 97654 32109',
    bloodGroup: 'AB+',
    age: 31,
    gender: 'Male',
    city: 'Delhi',
    address: 'Block C, Connaught Place',
    pincode: '110001',
    lastDonationDate: new Date('2024-05-18'),
    isAvailable: false,
    medicalNotes: 'Recovered from mild fever recently'
  },
  {
    fullName: 'Ananya Roy',
    email: 'ananya.r@example.com',
    phone: '+91 98321 09876',
    bloodGroup: 'AB-',
    age: 26,
    gender: 'Female',
    city: 'Kolkata',
    address: 'Park Street, Flat 4A',
    pincode: '700016',
    lastDonationDate: new Date('2024-04-12'),
    isAvailable: true,
    medicalNotes: 'Rare blood group donor'
  }
];

const sampleRequests = [
  {
    patientName: 'Ramesh Sundaram',
    bloodGroup: 'O+',
    unitsRequired: 2,
    hospitalName: 'Apollo Hospital',
    city: 'Chennai',
    contactPerson: 'Kavitha S (Wife)',
    contactPhone: '+91 94441 22334',
    urgency: 'Critical',
    neededDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
    reason: 'Emergency cardiac bypass surgery',
    status: 'Pending',
    notes: 'Urgent requirement within 12 hours'
  },
  {
    patientName: 'Meera Nair',
    bloodGroup: 'B-',
    unitsRequired: 3,
    hospitalName: 'Manipal Hospital',
    city: 'Bangalore',
    contactPerson: 'Suresh Nair (Brother)',
    contactPhone: '+91 98860 11223',
    urgency: 'Urgent',
    neededDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    reason: 'Severe anemia transfusion',
    status: 'Pending',
    notes: 'Rare blood group needed urgently'
  },
  {
    patientName: 'Karan Malhotra',
    bloodGroup: 'A+',
    unitsRequired: 1,
    hospitalName: 'Fortis Healthcare',
    city: 'Delhi',
    contactPerson: 'Rajesh Malhotra',
    contactPhone: '+91 98110 33445',
    urgency: 'Standard',
    neededDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    reason: 'Orthopedic procedure planned',
    status: 'Approved',
    notes: 'Scheduled for Friday morning'
  },
  {
    patientName: 'Sunita Joshi',
    bloodGroup: 'O-',
    unitsRequired: 2,
    hospitalName: 'Lilavati Hospital',
    city: 'Mumbai',
    contactPerson: 'Dr. Nitin Deshmukh',
    contactPhone: '+91 98200 55667',
    urgency: 'Critical',
    neededDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
    reason: 'Accident trauma care',
    status: 'Fulfilled',
    notes: 'Fulfilled by donor David Wilson'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood_donation_db');
    console.log('Connected to MongoDB for seeding...');

    await Donor.deleteMany({});
    console.log('Cleared existing donors.');

    await BloodRequest.deleteMany({});
    console.log('Cleared existing blood requests.');

    await Donor.insertMany(sampleDonors);
    console.log(`Inserted ${sampleDonors.length} sample donors.`);

    await BloodRequest.insertMany(sampleRequests);
    console.log(`Inserted ${sampleRequests.length} sample blood requests.`);

    console.log('Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();

