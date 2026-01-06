// Script để reset Firestore và seed lại data
// Chạy: node scripts/resetFirestore.js

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDP-KltcVfbZzfCfSNmtmbf9L4wKRAdR80",
  authDomain: "peak-coffee-3b1e0.firebaseapp.com",
  projectId: "peak-coffee-3b1e0",
  storageBucket: "peak-coffee-3b1e0.firebasestorage.app",
  messagingSenderId: "166401454852",
  appId: "1:166401454852:web:55964a878b94701cf1d651"
};

// Menu data
const MENU_DATA = [
  {
    id: '1',
    name: 'Cà Phê Sữa',
    category: 'Cà phê',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
    description: 'Cà phê phin truyền thống pha với sữa đặc.'
  },
  {
    id: '2',
    name: 'Cà Phê Đen',
    category: 'Cà phê',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    description: 'Cà phê phin đậm đà, nguyên chất 100%.'
  },
  {
    id: '3',
    name: 'Bạc Xỉu',
    category: 'Cà phê',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    description: 'Sữa nhiều, cà phê ít, vị ngọt dịu.'
  },
  {
    id: '4',
    name: 'Trà Sữa Trân Châu',
    category: 'Trà sữa',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800',
    description: 'Trà sữa Đài Loan với trân châu đen dai ngon.'
  },
  {
    id: '5',
    name: 'Trà Đào',
    category: 'Trà trái cây',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    description: 'Trà đen mix với đào tươi, thanh mát.'
  },
  {
    id: '6',
    name: 'Sinh Tố Bơ',
    category: 'Sinh tố',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800',
    description: 'Bơ Đăk Lăk xay với sữa tươi, béo ngậy.'
  },
  {
    id: '7',
    name: 'Nước Ép Cam',
    category: 'Nước ép',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
    description: 'Cam tươi ép 100%, giàu vitamin C.'
  },
  {
    id: '8',
    name: 'Ép Ổi',
    category: 'Nước ép',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
    description: 'Ổi đào ép tươi, thơm ngon bổ dưỡng.'
  }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetFirestore() {
  try {
    console.log('🔄 Starting Firestore reset...\n');
    
    // 1. Xóa tất cả menu items
    console.log('🗑️  Deleting old menu items...');
    const menuSnapshot = await getDocs(collection(db, 'menu'));
    for (const docSnapshot of menuSnapshot.docs) {
      await deleteDoc(doc(db, 'menu', docSnapshot.id));
      console.log(`   ✓ Deleted: ${docSnapshot.id}`);
    }
    
    // 2. Seed menu mới
    console.log('\n🌱 Seeding new menu data...');
    for (const item of MENU_DATA) {
      await setDoc(doc(db, 'menu', item.id), {
        ...item,
        isAvailable: true,
        createdAt: new Date().toISOString(),
      });
      console.log(`   ✓ Added: ${item.name}`);
    }
    
    // 3. Xóa user test (nếu có)
    console.log('\n🗑️  Cleaning test users...');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    for (const docSnapshot of usersSnapshot.docs) {
      await deleteDoc(doc(db, 'users', docSnapshot.id));
      console.log(`   ✓ Deleted user: ${docSnapshot.id}`);
    }
    
    // 4. Tạo Admin user
    console.log('\n👤 Creating Admin user...');
    await setDoc(doc(db, 'users', '1111111111'), {
      phone: '1111111111',
      name: 'Admin Peak Coffee',
      isAdmin: true,
      loyaltyPoints: 0,
      loyaltyVouchers: 0,
      streakDays: 0,
      lastOrderDate: null,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    });
    console.log('   ✓ Admin created: 1111111111');
    
    console.log('\n✅ Firestore reset complete!');
    console.log('📱 You can now login with: 1111111111');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting Firestore:', error);
    process.exit(1);
  }
}

resetFirestore();
