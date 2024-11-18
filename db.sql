CREATE DATABASE LibraryManagement;
USE LibraryManagement;

CREATE TABLE Publishers (
    publisher_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(225),
    address NVARCHAR(255)
);

CREATE TABLE Books (
    book_id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(225),
    isbn VARCHAR(13),
    publication_year INT,
    genre NVARCHAR(100),
    summary NVARCHAR(500),
    publisher_id INT,
    language NVARCHAR(20),
    file_path VARCHAR(255),
    FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id)
);

CREATE TABLE Authors (
    author_id INT PRIMARY KEY IDENTITY(1,1),
    first_name NVARCHAR(100),
    last_name NVARCHAR(100),
    birthdate DATE,
    nationality NVARCHAR(100)
);

CREATE TABLE Book_Authors (
    book_id INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(100),
    password_hash VARCHAR(225),
    first_name NVARCHAR(100),
    last_name NVARCHAR(100),
     role NVARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer', 'admin')),
    email VARCHAR(100),
    phone_number VARCHAR(20)
);

CREATE TABLE Favorites (
    favorite_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    book_id INT,
    added_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

CREATE TABLE Book_Reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    book_id INT,
    user_id INT,
    rating INT,
    review_text TEXT,
    review_date DATETIME,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Downloads (
    download_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    book_id INT,
    download_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id)
);
CREATE TABLE Departments (
    department_id INT PRIMARY KEY IDENTITY(1,1),
    department_name NVARCHAR(100)
);

CREATE TABLE Majors (
    major_id INT PRIMARY KEY IDENTITY(1,1),
    major_name NVARCHAR(100),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);
CREATE TABLE Students (
    student_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    major_id INT,
    course NVARCHAR(50),
    enrollment_year INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (major_id) REFERENCES Majors(major_id)
);

CREATE TABLE Lecturers (
    lecturer_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    major_id INT,
    position NVARCHAR(100),
    start_year INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (major_id) REFERENCES Majors(major_id)
);

CREATE TABLE LinkLibraries (
	link_id  INT PRIMARY KEY IDENTITY(1,1),
	ten_thuvien NVARCHAR(80),
	link_text NVARCHAR(500),
	date_at DATETIME

);

-- Thêm dữ liệu vào bảng LinkLibraries
INSERT INTO LinkLibraries (ten_thuvien,link_text,date_at) VALUES
(N'Thư Viện Hà Nội','https://thuvienhanoi.org.vn/',GETDATE()),
(N'Thư Viện Pháp Luật','https://thuvienphapluat.vn/',GETDATE()),
(N'Thư Viện Hoa Sen','https://thuvienhoasen.org/p22a10512/01-dao-phat',GETDATE());

-- Thêm dữ liệu vào bảng Publishers
INSERT INTO Publishers (name, address) VALUES
(N'NXB Kim Đồng', N'Hà Nội'),
(N'NXB Giáo Dục', N'Hà Nội'),
(N'NXB Trẻ', 'TP.HCM');

-- Thêm dữ liệu vào bảng Books
INSERT INTO Books (title, isbn, publication_year, genre, summary, publisher_id, language, file_path) VALUES
(N'Lập trình Java', '9781234567890', 2020, N'Giáo trình', N'Sách lập trình Java cơ bản', 1, N'Tiếng Việt', '/path/java.pdf'),
(N'Giải tích Toán học', '9782345678901', 2018, N'Giáo trình', N'Sách về giải tích toán học', 2, N'Tiếng Việt', '/path/giaitich.pdf'),
(N'Harry Potter', '9783456789012', 2001, N'Tiểu thuyết', N'Harry Potter và Hòn đá phù thủy', 3, N'Tiếng Anh', '/path/harrypotter.pdf');

-- Thêm dữ liệu vào bảng Authors
INSERT INTO Authors (first_name, last_name, birthdate, nationality) VALUES
(N'J.K.', 'Rowling', '1965-07-31', 'Anh'),
(N'Nguyễn', N'Nhân', '1980-04-12', N'Việt Nam'),
(N'Hoàng', N'Hải', '1975-09-23', N'Việt Nam'),
(N'Lê', N'Văn', '1970-01-15', N'Việt Nam'),
(N'Trần', N'Thủy', '1985-05-22', N'Việt Nam');

-- Thêm dữ liệu vào bảng Book_Authors
INSERT INTO Book_Authors (book_id, author_id) VALUES
(1, 4),
(2, 5),
(3, 3);

-- Thêm dữ liệu vào bảng Users
INSERT INTO Users (username, password_hash, first_name, last_name, role, email, phone_number) VALUES
('4451050437', '$2a$11$OkWDSvubFBNYixh2HZpfSeLIOP.blK2uQM6WD3nme0PKBjMDRabUy', 'Minh', 'Nguyen', 'student', 'student1@example.com', '0987654321'),
('4451050252', '$2a$11$14UD6Ge97EwXk1jJkmk5fOsH4utpVA/RQGKh9HwIeosEnKqsnDARO', 'An', 'Tran', 'lecturer', 'lecturer1@example.com', '0912345678'),
('TL012345', '$2a$11$yIcRk79O.C40OPuqkSpAz.6AJ4I0YLDnXVlf2V/JUxuy3W3amu0Fu', 'Binh', 'Le', 'admin', 'admin1@example.com', '0901234567'),
('admin1', 'hashedpassword4', 'Binh', 'Le', 'admin', 'admin1@example.com', '0901234567'),
('lecturer2', 'hashedpassword5', 'Tung', 'Pham', 'lecturer', 'lecturer2@example.com', '0938765432');

-- Thêm dữ liệu vào bảng Departments
INSERT INTO Departments (department_name) VALUES
(N'Khoa Công nghệ thông tin'),
(N'Khoa Toán học');

-- Thêm dữ liệu vào bảng Majors
INSERT INTO Majors (major_name, department_id) VALUES
(N'Công nghệ thông tin', 1),
(N'Toán học', 2);

-- Thêm dữ liệu vào bảng Students
INSERT INTO Students (user_id, major_id, course, enrollment_year) VALUES
(1, 2, 'K16', 2020);

INSERT INTO Lecturers (user_id, major_id, position, start_year) VALUES
(3, 2, N'Phó giáo sư', 2010),
(4, 2, N'Tiến sĩ', 2012),
(5, 2, N'Thạc sĩ', 2015),
(3, 2, N'Phó giáo sư', 2018),
(4, 2, N'Giáo sư', 2008);

INSERT INTO Publishers (name, address) VALUES
(N'NXB Văn Học', N'Đà Nẵng'),
(N'NXB Khoa Học', N'Huế');

INSERT INTO Books (title, isbn, publication_year, genre, summary, publisher_id, language, file_path) VALUES
(N'Lập trình C++', '9784567890123', 2019, N'Giáo trình', N'Sách lập trình C++ nâng cao', 4, N'Tiếng Việt', '/path/cpp.pdf'),
(N'Văn học Việt Nam', '9785678901234', 2021, N'Văn học', N'Tuyển tập văn học Việt Nam hiện đại', 5, N'Tiếng Việt', '/path/vanhoc.pdf');

INSERT INTO Downloads (user_id, book_id, download_date) VALUES
(1, 1, getdate()),
(2, 2, getdate()),
(3, 3, getdate());

INSERT INTO Book_Reviews (book_id, user_id, rating, review_text, review_date) VALUES
(1, 1, 5, N'Rất hay và bổ ích', GETDATE()),
(2, 2, 4, N'Giải thích dễ hiểu', GETDATE()),
(3, 3, 5, N'Cực kỳ hấp dẫn', GETDATE());


INSERT INTO Students (user_id,major_id, course, enrollment_year) VALUES
(2, 2, 'K16', 2020),
(3, 2, 'K17', 2021)


INSERT INTO Favorites (user_id, book_id, added_date) VALUES
(1, 1, GETDATE()),
(1, 3, GETDATE()),
(2, 2, GETDATE());
