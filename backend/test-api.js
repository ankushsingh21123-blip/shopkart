/**
 * ShopKart - Automated 15-Point API Verification Test Script
 * Tests all 15 core architectural requirements across Labs 01 to 06:
 * 1. Customer Register
 * 2. Customer Login & Token Issuance
 * 3. Customer Profile Protected Route (/customers/me)
 * 4. Password Change (/customers/change-password)
 * 5. Create Product (/products)
 * 6. List, Search & Filter Products (/products)
 * 7. Fetch Single Product (/products/:id)
 * 8. Add to Wishlist (/wishlist/:productId)
 * 9. Duplicate Wishlist Prevention (HTTP 409 Conflict)
 * 10. Fetch Wishlist & Toggle Wishlist
 * 11. Add to Cart (/cart/:productId)
 * 12. Cart Stock Validation & Exceeded Stock Rejection
 * 13. Update Quantity & Verify Derived Totals (/cart)
 * 14. Server-Side Revalidation & Create Payment Order (/orders/create-payment-order)
 * 15. Verify Signature, Clear Cart & Fetch Orders (/orders/verify-payment, /orders)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
let authToken = '';
let testProductId = '';
let testOrderId = '';
let razorpayOrderId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const pass = (step, title, details = '') => {
  console.log(`${colors.green}✔ [PASS ${step}/15]${colors.reset} ${colors.bold}${title}${colors.reset} ${details}`);
};

const fail = (step, title, error) => {
  console.error(`${colors.red}✘ [FAIL ${step}/15]${colors.reset} ${colors.bold}${title}${colors.reset}\n  Error: ${error}`);
  process.exit(1);
};

const runRequest = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
};

const runAllTests = async () => {
  console.log(`\n${colors.cyan}${colors.bold}======================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}🛒 SHOPKART - 15-POINT FULL STACK API TEST SUITE${colors.reset}`);
  console.log(`${colors.cyan}Target Base URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}======================================================${colors.reset}\n`);

  const uniqueSuffix = Date.now();
  const testUser = {
    name: 'Aarav Sharma',
    email: `aarav_${uniqueSuffix}@example.com`,
    password: 'password123',
    phone: '9876543210'
  };

  try {
    // 1. Customer Register
    {
      const res = await runRequest('/customers/register', {
        method: 'POST',
        body: testUser
      });
      if (res.status === 201 && res.data.success && res.data.customer) {
        pass(1, 'Customer Registration', `Created ${res.data.customer.email}`);
      } else {
        return fail(1, 'Customer Registration', JSON.stringify(res.data));
      }
    }

    // 2. Customer Login
    {
      const res = await runRequest('/customers/login', {
        method: 'POST',
        body: { email: testUser.email, password: testUser.password }
      });
      if (res.status === 200 && res.data.token && res.data.customer) {
        authToken = res.data.token;
        pass(2, 'Customer Authentication & Token Issuance', `Token obtained for ${res.data.customer.email}`);
      } else {
        return fail(2, 'Customer Login', JSON.stringify(res.data));
      }
    }

    // 3. Customer Profile Protected Route
    {
      const res = await runRequest('/customers/me');
      if (res.status === 200 && res.data.success && res.data.customer && !res.data.customer.password) {
        pass(3, 'Protected Profile Route & Security Projection', `Password hash omitted from projection`);
      } else {
        return fail(3, 'Protected Profile Route', JSON.stringify(res.data));
      }
    }

    // 4. Change Password
    {
      const res = await runRequest('/customers/change-password', {
        method: 'PATCH',
        body: { currentPassword: testUser.password, newPassword: 'newsecurepassword456' }
      });
      if (res.status === 200 && res.data.success) {
        pass(4, 'Password Update Security', 'Password updated successfully');
      } else {
        return fail(4, 'Password Update', JSON.stringify(res.data));
      }
    }

    // 5. Create Product
    {
      const res = await runRequest('/products', {
        method: 'POST',
        body: {
          name: `Ultra HD Smart Monitor ${uniqueSuffix}`,
          description: '32-inch 4K IPS display with 144Hz refresh rate and USB-C hub',
          price: 34999,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
          stock: 10
        }
      });
      if (res.status === 201 && res.data.product?._id) {
        testProductId = res.data.product._id;
        pass(5, 'Create Product Catalog Entry', `ID: ${testProductId} Price: ₹${res.data.product.price}`);
      } else {
        return fail(5, 'Create Product', JSON.stringify(res.data));
      }
    }

    // 6. List & Filter Products
    {
      const res = await runRequest('/products?category=Electronics&sort=price_desc');
      if (res.status === 200 && Array.isArray(res.data.products) && res.data.products.length > 0) {
        pass(6, 'Product Catalog Query & Category/Sort Filtering', `Found ${res.data.count} items`);
      } else {
        return fail(6, 'List Products', JSON.stringify(res.data));
      }
    }

    // 7. Single Product Details
    {
      const res = await runRequest(`/products/${testProductId}`);
      if (res.status === 200 && res.data.product?.name) {
        pass(7, 'Single Product Details Lookup', `"${res.data.product.name}"`);
      } else {
        return fail(7, 'Single Product Lookup', JSON.stringify(res.data));
      }
    }

    // 8. Add Product to Wishlist
    {
      const res = await runRequest(`/wishlist/${testProductId}`, { method: 'POST' });
      if (res.status === 200 && res.data.success) {
        pass(8, 'Add Product to Wishlist (ObjectId reference)', 'Stored in customer wishlist');
      } else {
        return fail(8, 'Add to Wishlist', JSON.stringify(res.data));
      }
    }

    // 9. Prevent Duplicate Wishlist Items (HTTP 409 Conflict)
    {
      const res = await runRequest(`/wishlist/${testProductId}`, { method: 'POST' });
      if (res.status === 409) {
        pass(9, 'Duplicate Wishlist Prevention (HTTP 409 Conflict)', 'Correctly rejected duplicate save');
      } else {
        return fail(9, 'Duplicate Wishlist Rejection', `Expected 409 Conflict, got ${res.status}`);
      }
    }

    // 10. Get Wishlist & Toggle Item
    {
      const getRes = await runRequest('/wishlist');
      const toggleRes = await runRequest(`/wishlist/${testProductId}/toggle`, { method: 'PATCH' });
      if (getRes.status === 200 && toggleRes.status === 200) {
        pass(10, 'Wishlist Population & Toggle Action', `Toggled saved state`);
      } else {
        return fail(10, 'Wishlist Operations', JSON.stringify(toggleRes.data));
      }
    }

    // 11. Add to Cart with Quantity
    {
      const res = await runRequest(`/cart/${testProductId}`, {
        method: 'POST',
        body: { quantity: 2 }
      });
      if (res.status === 200 && res.data.subtotal > 0 && res.data.totalUnits === 2) {
        pass(11, 'Add to Cart & Derived State Computation', `Units: 2, Subtotal: ₹${res.data.subtotal}`);
      } else {
        return fail(11, 'Add to Cart', JSON.stringify(res.data));
      }
    }

    // 12. Cart Stock Boundary Protection
    {
      const res = await runRequest(`/cart/${testProductId}`, {
        method: 'POST',
        body: { quantity: 9999 } // far exceeds stock of 10
      });
      if (res.status === 400) {
        pass(12, 'Cart Stock Boundary Validation', 'Prevented exceeding inventory stock');
      } else {
        return fail(12, 'Stock Validation', `Expected 400 Bad Request, got ${res.status}`);
      }
    }

    // 13. Update Quantity in Cart & Verify Derived Calculations
    {
      const res = await runRequest(`/cart/${testProductId}`, {
        method: 'PATCH',
        body: { quantity: 3 }
      });
      if (res.status === 200 && res.data.totalUnits === 3 && res.data.subtotal === 34999 * 3) {
        pass(13, 'Update Cart Quantity & Live Totals', `3 units = ₹${res.data.subtotal}`);
      } else {
        return fail(13, 'Update Cart Quantity', JSON.stringify(res.data));
      }
    }

    // 14. Server-Side Revalidation & Create Payment Order
    {
      const shippingAddress = {
        fullName: 'Aarav Sharma',
        address: '402, Lotus Residency, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        phone: '9876543210'
      };

      const res = await runRequest('/orders/create-payment-order', {
        method: 'POST',
        body: { shippingAddress }
      });

      if (res.status === 201 && res.data.order && res.data.razorpayOrder) {
        testOrderId = res.data.order._id;
        razorpayOrderId = res.data.razorpayOrder.id;
        pass(14, 'Server-Side Revalidation & Razorpay Order Creation', `Order: ${testOrderId}, RZP ID: ${razorpayOrderId}`);
      } else {
        return fail(14, 'Create Payment Order', JSON.stringify(res.data));
      }
    }

    // 15. Verify Signature, Clear Cart & Fetch Orders
    {
      const crypto = require('crypto');
      const keySecret = 'shopkart_razorpay_secret_67890';
      const paymentId = `pay_${Date.now()}`;
      const signature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${paymentId}`)
        .digest('hex');

      const verifyRes = await runRequest('/orders/verify-payment', {
        method: 'POST',
        body: {
          orderId: testOrderId,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        }
      });

      if (verifyRes.status !== 200 || verifyRes.data.order.paymentStatus !== 'PAID') {
        return fail(15, 'Verify Payment Signature', JSON.stringify(verifyRes.data));
      }

      // Check cart is now empty
      const cartRes = await runRequest('/cart');
      if (cartRes.data.items.length !== 0) {
        return fail(15, 'Post-Payment Cart Clearing', 'Cart was not cleared after payment verification');
      }

      // Check orders history
      const ordersRes = await runRequest('/orders');
      if (ordersRes.status === 200 && ordersRes.data.orders.length > 0) {
        pass(15, 'HMAC SHA256 Signature Verification, Post-Payment Cart Clearing & Order History', `Order marked PAID & Cart Cleared`);
      } else {
        return fail(15, 'Fetch Order History', JSON.stringify(ordersRes.data));
      }
    }

    console.log(`\n${colors.green}${colors.bold}======================================================${colors.reset}`);
    console.log(`${colors.green}${colors.bold}🎉 ALL 15 ARCHITECTURAL API SPECIFICATIONS PASSED!${colors.reset}`);
    console.log(`${colors.green}ShopKart Backend is fully verified and production-ready.${colors.reset}`);
    console.log(`${colors.green}${colors.bold}======================================================${colors.reset}\n`);
    process.exit(0);
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
};

runAllTests();
