# 📋 Intern Task Management System (Web Frontend)

ระบบจัดการงานสำหรับนักศึกษาฝึกงาน (Intern Task Management System) พัฒนาด้วย **Angular** เพื่อเป็นเครื่องมือช่วยในการมอบหมายงาน ติดตามความคืบหน้า และประเมินผลการทำงานของนักศึกษาฝึกงานภายในองค์กร ระบบถูกออกแบบมาให้ใช้งานง่าย รองรับการแบ่งสิทธิ์ผู้ใช้งาน และทำงานร่วมกับ API ฝั่ง Backend (Spring Boot) ได้อย่างสมบูรณ์แบบ

## ✨ ฟีเจอร์หลัก (Key Features)

ระบบมีการแบ่งสิทธิ์การใช้งาน (Role-Based Access Control) ออกเป็น 3 ระดับ ดังนี้:

### 👨‍💼 1. Admin (ผู้ดูแลระบบ)
* **Admin Dashboard:** ดูสถิติภาพรวมของระบบ จำนวนผู้ใช้งาน และจำนวนงานทั้งหมด
* **User Management:** ระบบจัดการบัญชีผู้ใช้งาน (เพิ่ม/แก้ไขข้อมูล) ด้วยฟอร์มที่ได้มาตรฐาน
* **Active/Inactive Toggle:** ระบบปุ่มสวิตช์ เปิด-ปิดสถานะบัญชีผู้ใช้งานได้แบบ Real-time โดยไม่ต้องรีเฟรชหน้าจอ

### 🧑‍🏫 2. Mentor (พี่เลี้ยง)
* **Task Management:** สร้าง, แก้ไข, ลบ และมอบหมายงานให้นักศึกษาฝึกงาน
* **Group & Single Tasks:** รองรับฟีเจอร์การสั่ง "งานเดี่ยว" และ "งานกลุ่ม" (สามารถเลือก Intern ได้หลายคนพร้อมกัน)
* **Real-time Search:** ค้นหารายชื่อนักศึกษาฝึกงานเพื่อมอบหมายงานได้อย่างรวดเร็ว
* **Task Tracking & Review:** ติดตามสถานะงานที่สั่งไป, ตรวจงาน และดูประวัติการเปลี่ยนสถานะงาน
* **Commenting System:** ระบบคอมเมนต์สำหรับพูดคุย ให้คำแนะนำ และแจ้งแก้ไขงานกับ Intern ได้โดยตรงในหน้ารายละเอียดงาน

### 🎓 3. Intern (นักศึกษาฝึกงาน)
* **Intern Dashboard:** หน้ากระดานสรุปสถิติงานของตนเอง (To Do, In Progress, Pending)
* **Upcoming Tasks:** ตารางสรุปงานด่วนที่กำลังจะถึงกำหนดส่ง (Due Date)
* **Task Filtering & Searching:** ระบบค้นหางานด้วยชื่อหัวข้อ หรือ "ชื่อพี่เลี้ยงผู้สั่งงาน" พร้อมระบบกรองตามสถานะงานแบบ Real-time
* **Task Execution:** กดปุ่มเพื่อเปลี่ยนสถานะการทำงาน (เช่น "เริ่มงาน") และส่งงานเพื่อรอการตรวจสอบ (Pending)
* **Interactive Task Detail:** ดูรายละเอียดงาน, ประวัติสถานะ และคอมเมนต์โต้ตอบกับพี่เลี้ยงได้ทันที

## 🚀 เทคโนโลยีและโครงสร้าง (Tech Stack & Best Practices)

โปรเจกต์นี้เขียนขึ้นโดยยึดตามมาตรฐานการพัฒนา (Frontend Best Practices) อย่างเคร่งครัด:
* **Framework:** Angular (TypeScript)
* **UI/UX Design:** CSS3, Angular Material (เน้นดีไซน์ Modern Clean & Responsive)
* **Forms:** ใช้ Reactive Forms พร้อม Form Validation เต็มรูปแบบ
* **Security:** มี Route Guards ป้องกันการเข้าถึงหน้าเว็บข้ามสิทธิ์
* **Interceptors:**
    * `JwtInterceptor`: จัดการแนบ Auth Token ไปกับทุก API อัตโนมัติ
    * `LoadingInterceptor`: ดักจับ API เพื่อแสดง Loading Spinner กลางหน้าจอแบบรวมศูนย์
* **User Experience (UX):** ติดตั้ง `NProgress` แถบโหลดสถานะด้านบนขอบจอ เพื่อให้ผู้ใช้ทราบเมื่อระบบกำลังทำงานเบื้องหลัง

## 🛠️ การติดตั้งและรันโปรเจกต์ (Installation & Setup)

**ข้อกำหนดเบื้องต้น (Prerequisites):**
* เครื่องของคุณต้องติดตั้ง [Node.js](https://nodejs.org/) และ [Angular CLI](https://angular.io/cli) 

**ขั้นตอนการรันโปรเจกต์:**

1. **Clone โปรเจกต์ลงมาที่เครื่อง:**
   ```bash
   git clone [https://github.com/rubianya/Intern-Task-Management-Syste-Web.git](https://github.com/rubianya/Intern-Task-Management-Syste-Web.git)
   cd Intern-Task-Management-Syste-Web

2. **ติดตั้ง Dependencies (แพ็กเกจที่จำเป็น):**
    ```bash
    npm install
    ```
    หรือ
    ```bash
    npm i
    ```

3. **รันโปรเจกต์ (Development Server):**
    ```bash
    ng serve
    ```
    หรือ
    ```bash
    ng s
    ```
    เมื่อเซิร์ฟเวอร์ทำงานแล้ว ให้เปิดเบราว์เซอร์ของคุณและไปที่ `http://localhost:4200/`
    แอปพลิเคชันจะโหลดใหม่โดยอัตโนมัติทุกครั้งที่คุณแก้ไขไฟล์ต้นฉบับใดๆ