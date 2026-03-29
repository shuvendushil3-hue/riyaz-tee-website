import requests
import sys
from datetime import datetime
import json

class RiyazTeeAPITester:
    def __init__(self, base_url="https://rhythm-wear-2.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.access_token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_id = None
        self.admin_user_id = None
        self.created_product_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, use_admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Use appropriate token
        token = self.admin_token if use_admin else self.access_token
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"testuser_{datetime.now().strftime('%H%M%S')}@test.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": test_email,
                "password": "test123",
                "name": "Test User"
            }
        )
        if success and '_id' in response:
            self.test_user_id = response['_id']
            return True
        return False

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": "admin@riyaztee.com",
                "password": "admin123"
            }
        )
        if success and '_id' in response:
            self.admin_user_id = response['_id']
            # Extract token from cookies if available
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": "user@test.com",
                "password": "test123"
            }
        )
        if success and '_id' in response:
            return True
        return False

    def test_get_products(self):
        """Test getting all products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        if success and isinstance(response, list) and len(response) >= 5:
            print(f"   Found {len(response)} products")
            return True
        return False

    def test_get_single_product(self):
        """Test getting a single product"""
        # First get all products to get a valid ID
        success, products = self.run_test("Get Products for Single Test", "GET", "products", 200)
        if success and products and len(products) > 0:
            product_id = products[0]['id']
            success, response = self.run_test(
                "Get Single Product",
                "GET",
                f"products/{product_id}",
                200
            )
            return success and 'id' in response
        return False

    def test_create_product_admin(self):
        """Test creating a product as admin"""
        success, response = self.run_test(
            "Create Product (Admin)",
            "POST",
            "products",
            200,
            data={
                "name": "Test Product",
                "description": "A test product for API testing",
                "price": 1299,
                "category": "t-shirt",
                "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                "sizes": ["S", "M", "L", "XL", "XXL"],
                "stock": {"S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10}
            },
            use_admin=True
        )
        if success and 'id' in response:
            self.created_product_id = response['id']
            return True
        return False

    def test_update_product_admin(self):
        """Test updating a product as admin"""
        if not self.created_product_id:
            print("   Skipping - No product created to update")
            return False
            
        success, response = self.run_test(
            "Update Product (Admin)",
            "PUT",
            f"products/{self.created_product_id}",
            200,
            data={
                "name": "Updated Test Product",
                "price": 1399
            },
            use_admin=True
        )
        return success

    def test_delete_product_admin(self):
        """Test deleting a product as admin"""
        if not self.created_product_id:
            print("   Skipping - No product created to delete")
            return False
            
        success, response = self.run_test(
            "Delete Product (Admin)",
            "DELETE",
            f"products/{self.created_product_id}",
            200,
            use_admin=True
        )
        return success

    def test_cart_operations(self):
        """Test cart operations"""
        # Get a product first
        success, products = self.run_test("Get Products for Cart", "GET", "products", 200)
        if not success or not products:
            return False
            
        product_id = products[0]['id']
        
        # Add to cart
        success, response = self.run_test(
            "Add to Cart",
            "POST",
            "cart/add",
            200,
            data={
                "product_id": product_id,
                "size": "M",
                "quantity": 2
            }
        )
        if not success:
            return False
            
        # Get cart
        success, response = self.run_test(
            "Get Cart",
            "GET",
            "cart",
            200
        )
        if not success or 'items' not in response:
            return False
            
        # Update cart item
        success, response = self.run_test(
            "Update Cart Item",
            "PUT",
            "cart/update",
            200,
            data={
                "product_id": product_id,
                "size": "M",
                "quantity": 3
            }
        )
        if not success:
            return False
            
        # Remove from cart
        success, response = self.run_test(
            "Remove from Cart",
            "DELETE",
            f"cart/remove/{product_id}/M",
            200
        )
        return success

    def test_order_operations(self):
        """Test order operations"""
        # First add something to cart
        success, products = self.run_test("Get Products for Order", "GET", "products", 200)
        if not success or not products:
            return False
            
        product = products[0]
        
        # Add to cart
        success, response = self.run_test(
            "Add to Cart for Order",
            "POST",
            "cart/add",
            200,
            data={
                "product_id": product['id'],
                "size": "L",
                "quantity": 1
            }
        )
        if not success:
            return False
            
        # Create order
        success, response = self.run_test(
            "Create Order",
            "POST",
            "orders/create",
            200,
            data={
                "items": [{
                    "product_id": product['id'],
                    "product_name": product['name'],
                    "size": "L",
                    "quantity": 1,
                    "price": product['price']
                }],
                "shipping_info": {
                    "name": "Test User",
                    "email": "test@test.com",
                    "phone": "9876543210",
                    "address": "123 Test Street",
                    "city": "Test City",
                    "state": "Test State",
                    "pincode": "123456"
                },
                "total": product['price']
            }
        )
        if not success or 'order_id' not in response:
            return False
            
        order_id = response['order_id']
        
        # Get user orders
        success, response = self.run_test(
            "Get User Orders",
            "GET",
            "orders",
            200
        )
        if not success:
            return False
            
        # Get specific order
        success, response = self.run_test(
            "Get Specific Order",
            "GET",
            f"orders/{order_id}",
            200
        )
        return success

    def test_admin_orders(self):
        """Test admin order operations"""
        success, response = self.run_test(
            "Get All Orders (Admin)",
            "GET",
            "orders/admin/all",
            200,
            use_admin=True
        )
        return success and isinstance(response, list)

    def test_review_operations(self):
        """Test review operations"""
        # Get a product first
        success, products = self.run_test("Get Products for Review", "GET", "products", 200)
        if not success or not products:
            return False
            
        product_id = products[0]['id']
        
        # Create review
        success, response = self.run_test(
            "Create Review",
            "POST",
            "reviews",
            200,
            data={
                "product_id": product_id,
                "rating": 5,
                "comment": "Great product! Love the quality and design."
            }
        )
        if not success:
            return False
            
        # Get product reviews
        success, response = self.run_test(
            "Get Product Reviews",
            "GET",
            f"reviews/product/{product_id}",
            200
        )
        return success and isinstance(response, list)

    def test_auth_me(self):
        """Test getting current user info"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success and '_id' in response

    def test_logout(self):
        """Test logout"""
        success, response = self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200
        )
        return success

def main():
    print("🚀 Starting Riyaz Tee API Testing...")
    print("=" * 50)
    
    tester = RiyazTeeAPITester()
    
    # Test sequence
    tests = [
        # Auth tests
        ("User Registration", tester.test_user_registration),
        ("Admin Login", tester.test_admin_login),
        ("User Login", tester.test_user_login),
        ("Get Current User", tester.test_auth_me),
        
        # Product tests
        ("Get All Products", tester.test_get_products),
        ("Get Single Product", tester.test_get_single_product),
        ("Create Product (Admin)", tester.test_create_product_admin),
        ("Update Product (Admin)", tester.test_update_product_admin),
        ("Delete Product (Admin)", tester.test_delete_product_admin),
        
        # Cart tests
        ("Cart Operations", tester.test_cart_operations),
        
        # Order tests
        ("Order Operations", tester.test_order_operations),
        ("Admin Orders", tester.test_admin_orders),
        
        # Review tests
        ("Review Operations", tester.test_review_operations),
        
        # Auth cleanup
        ("Logout", tester.test_logout),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            if not result:
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print("\n✅ All tests passed!")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())