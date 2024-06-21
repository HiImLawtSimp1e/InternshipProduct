# Internship Product

This is my internship project.

You have already installed .NET 6.0 SDK runtime & Node.js 20.0 to run this project

## 🚀 Quick start

1.  **Step 1.**
    Clone the project
    ```sh
    git clone https://github.com/HiImLawtSimp1e/InternshipProduct.git
    ```  
1.  **Step 2.**
    * Move to backend
    ```sh
    cd ./InternshipBackend
    ```
    * Change connection string to your database in `API/appsettings.json` & `Data/Context`
    ```sh
     "ConnectionStrings": {
    "DefaultConnection": "server=localhost\\sqlexpress;database=nextecommerce;trusted_connection=true"
    },
    ```
    ```
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("server=localhost\\sqlexpress;database=nextecommerce; trusted_connection=true;");
        }
    ```
    * Import database
    ```
    add-migration InitialDb
    ```
    ```
    update-database
    ```
    * Run hosting backend with VS2022
1.  **Step 3.**
    * Move to frontend
     ```sh
    cd ./internship-frontend
    ```
    * Install the project dependencies with:
     ```sh
    npm i
    ```
    * Add your cloud name as an environment variable inside `.env.local`:

    ```
    NEXT_PUBLIC_TINYMCE_API_KEY=<Your TinyMCE Key>
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<Your Cloudinary's Cloud Name>"
    CLOUDINARY_API_KEY="<Your Cloudniary API Key>"
    CLOUDINARY_API_SECRET="<Your Cloundinary API Secret>"
    ```
    * Start the development server frontend with:
    ```
    npm run dev
    ```
   
