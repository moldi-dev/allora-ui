import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-950 py-6 text-center text-white">
            <div className="mb-4 md:mb-0">
                <p>&copy; Allora 2024</p>
            </div>
            <div className="mt-4">
                <h4 className="text-lg">Contact Us</h4>
                <p className="mt-2">Email: <a href="mailto:info@allora.com"
                                              className="text-white underline">info@allora.com</a></p>
                <p>Phone: <a href="tel:+1234567890" className="text-white underline">+1 (234) 567-890</a></p>
                <div className="mt-2">
                    <a href="https://www.facebook.com/allora" target="_blank" rel="noopener noreferrer"
                       className="text-white mr-4">Facebook</a>
                    <a href="https://www.instagram.com/allora" target="_blank" rel="noopener noreferrer"
                       className="text-white">Instagram</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;