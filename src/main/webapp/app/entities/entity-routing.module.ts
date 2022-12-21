import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'student',
        data: { pageTitle: 'schoolApp.student.home.title' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'teacher',
        data: { pageTitle: 'schoolApp.teacher.home.title' },
        loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
      },
      {
        path: 'course',
        data: { pageTitle: 'schoolApp.course.home.title' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      {
        path: 'fees',
        data: { pageTitle: 'schoolApp.fees.home.title' },
        loadChildren: () => import('./fees/fees.module').then(m => m.FeesModule),
      },
      {
        path: 'attendance',
        data: { pageTitle: 'schoolApp.attendance.home.title' },
        loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule),
      },
      {
        path: 'student-id-card',
        data: { pageTitle: 'schoolApp.studentIDCard.home.title' },
        loadChildren: () => import('./student-id-card/student-id-card.module').then(m => m.StudentIDCardModule),
      },
      {
        path: 'parent',
        data: { pageTitle: 'schoolApp.parent.home.title' },
        loadChildren: () => import('./parent/parent.module').then(m => m.ParentModule),
      },
      {
        path: 'note',
        data: { pageTitle: 'schoolApp.note.home.title' },
        loadChildren: () => import('./note/note.module').then(m => m.NoteModule),
      },
      {
        path: 'home',
        data: { pageTitle: 'schoolApp.home.home.title' },
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
