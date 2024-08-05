const data = {
  sizes: [
    { id: 1, name: "XS" },
    { id: 2, name: "S" },
    { id: 3, name: "M" },
    { id: 4, name: "L" },
    { id: 5, name: "XXL" },
  ],
  categories: [
    { id: 1, name: "Shirt" },
    { id: 2, name: "T-shirt" },
    { id: 3, name: "Pants" },
    { id: 4, name: "Jeans" },
    { id: 5, name: "Skirt" },
    { id: 6, name: "Dress" },
    { id: 7, name: "Jacket" },
    { id: 8, name: "Sweater" },
    { id: 9, name: "Coat" },
    { id: 10, name: "Blouse" },
  ],
  colors: [
    { id: 1, name: "Red" },
    { id: 2, name: "Blue" },
    { id: 3, name: "Green" },
    { id: 4, name: "Yellow" },
    { id: 5, name: "Purple" },
    { id: 6, name: "Orange" },
    { id: 7, name: "Brown" },
    { id: 8, name: "Pink" },
    { id: 9, name: "Grey" },
    { id: 10, name: "Beige" },
    { id: 11, name: "Maroon" },
  ],
  products: [
    {
      id: 1,
      name: "White Dress",
      image: "dress/avt.jpg",
      price: 25,
      price_old: 35,
      discount_amount: 5,
      category: 6,
      color_ids: [1, 2, 3],
      sizes: [2, 3, 4],
      created_at: "11/01/2024",
    },
    {
      id: 2,
      name: "Floral Dress",
      image: "t1-5.avif",
      price: 40,
      discount_amount: 2,
      category: 6,
      color_ids: [4, 5],
      created_at: "11/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 3,
      name: "Blue Dress",
      image: "dress/avt2.jpg",
      price: 50,
      discount_amount: 2,
      category: 6,
      color_ids: [6, 7],
      created_at: "11/01/2024",
      sizes: [1, 4, 3],
    },
    {
      id: 4,
      name: "Red Sweater",
      image: "sk1.jpg",
      price: 35,
      discount_amount: 4.3,
      category: 5,
      color_ids: [8],
      created_at: "02/01/2024",
      sizes: [2, 5],
    },
    {
      id: 5,
      name: "Black Jacket",
      image: "j4.jpg",
      price: 55,
      price_old: 75,
      discount_amount: 3,
      category: 7,
      color_ids: [9, 10],
      created_at: "09/01/2024",
      sizes: [1, 2, 5],
    },
    {
      id: 6,
      name: "white Blouse",
      image: "bl1.jpg",
      price: 30,
      discount_amount: 1,
      category: 10,
      color_ids: [3,7],
      created_at: "01/01/2024",
      sizes: [4, 1],
    },
    {
      id: 7,
      name: "Gray Coat",
      image: "c1.jpg",
      price: 60,
      price_old: 70,
      discount_amount: 4,
      category: 9,
      color_ids: [2,5,4],
      created_at: "09/01/2024",
      sizes: [4, 2, 3],
    },
    {
      id: 8,
      name: "sweater Skirt",
      image: "sw1.jpg",
      price: 45,
      price_old: 50,
      discount_amount: 5,
      category: 5,
      color_ids: [10,11],
      created_at: "09/12/2023",
      sizes: [1, 2, 4],
    },
    {
      id: 9,
      name: "Brown Boots",
      image: "p4.jpg",
      price: 70,
      discount_amount: 2.4,
      category: 3,
      color_ids: [3,8],
      created_at: "02/01/2024",
      sizes: [1, 2, 7],
    },
    {
      id: 10,
      name: "Yellow Shorts",
      image: "sk7.jpg",
      price: 20,
      discount_amount: 3,
      category: 5,
      color_ids: [1,8],
      created_at: "09/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 11,
      name: "Red Tie",
      image: "sk4.jpg",
      price: 15,
      discount_amount: 2,
      category: 10,
      color_ids: [3,6,2],
      created_at: "09/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 12,
      name: "Black Shoes",
      image: "p1.jpg",
      price: 65,
      discount_amount: 4,
      category: 3,
      color_ids: [2,4],
      created_at: "09/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 13,
      name: "Beige Hat",
      image: "j1.jpg",
      price: 18,
      discount_amount: 2,
      category: 4,
      color_ids: [4,8,2],
      created_at: "09/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 14,
      name: "Blue Gloves",
      image: "t-5.avif",
      price: 12,
      discount_amount: 2,
      category: 2,
      color_ids: [2,7,1],
      created_at: "09/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 15,
      name: "Striped Scarf",
      image: "t-7.avif",
      price: 22,
      discount_amount: 4,
      category: 2,
      color_ids: [1,2,4],
      created_at: "09/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 16,
      name: "Green Socks",
      image: "sw5.jpg",
      price: 8,
      discount_amount: 5,
      category: 8,
      color_ids: [5,3,4],
      created_at: "09/01/2024",
      sizes: [1, 2, 3],
    },
    {
      id: 17,
      name: "Purple Suit",
      image: "sw7.jpg",
      price: 90,
      discount_amount: 2,
      category: 8,
      color_ids: [9,10,11],
      created_at: "09/01/2024",
      sizes: [1, 2, 3, 5],
    },
    {
      id: 18,
      name: "Orange dress",
      image: "dress/avt.jpg",
      price: 75,
      discount_amount: 2,
      category: 6,
      color_ids: [4,6,9],
      created_at: "01/01/2024",
      sizes: [1, 2, 4],
    },
  ],
  "productDetails" : [
    {
      id:1,
      product_id : 14,
      image_details: ["t-1.avif" , "t-2.avif" , "t-3.avif" , "t-4.avif"],
      des: "With its crisp collar and long sleeves, this shirt seamlessly transitions from formal to casual settings. Pair it with tailored trousers for a polished office ensemble, or wear it untucked with jeans for a relaxed yet refined weekend outfit."
    },
    {
      id:2,
      product_id : 2,
      image_details: ["t1-2.avif" , "t1-3.avif" , "t1-4.avif" , "t1-5.avif"],
      des:"This men's casual striped shirt is a versatile addition to any wardrobe. Crafted from premium cotton fabric, it offers both comfort and style for various occasions.The shirt features a classic button-down design with vertical stripes, creating a sophisticated and trendy look. Its tailored fit provides a flattering silhouette without compromising on ease of movement."
    },
    {
      id:3,
      product_id : 15,
      image_details: ["t-6.avif" , "t-5.avif" , "t-3.avif"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    },
    {
      id:4,
      product_id : 1,
      image_details: ["dress/1.jpg" , "dress/2.jpg" ,"dress/3.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    },
    {
      id:5,
      product_id : 18,
      image_details: ["dress/5.jpg" , "dress/6.jpg" ,"dress/7.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:6,
      product_id : 3,
      image_details: ["dress/8.jpg" , "dress/9.jpg" ,"dress/10.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:7,
      product_id : 8,
      image_details: ["sw2.jpg" , "sw3.jpg" ,"sw4.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:8,
      product_id : 6,
      image_details: ["bl2.jpg" , "bl3.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:9,
      product_id : 4,
      image_details: ["sk2.jpg" , "sk3.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:10,
      product_id : 11,
      image_details: ["sk5.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:11,
      product_id : 12,
      image_details: ["p2.jpg","p3.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:12,
      product_id : 13,
      image_details: ["j2.jpg","j3.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:13,
      product_id : 16,
      image_details: ["sw6.jpg","sw7.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:14,
      product_id : 17,
      image_details: ["sw8.jpg","sw9.jpg","sw10.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:15,
      product_id : 9,
      image_details: ["p5.jpg","p6.jpg","p7.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:16,
      product_id : 5,
      image_details: ["j5.jpg","j6.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:17,
      product_id : 7,
      image_details: ["c2.jpg","c3.jpg","c4.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
    ,
    {
      id:18,
      product_id : 10,
      image_details: ["sk7.jpg","sk8.jpg"],
      des:"Available in multiple sizes and color combinations, this shirt combines modern fashion with timeless appeal, making it a must-have for the modern man's closet.Elevate your style effortlessly with this men's casual striped shirt, offering comfort, quality, and effortless elegance."
    }
  ]
};
export default data;
