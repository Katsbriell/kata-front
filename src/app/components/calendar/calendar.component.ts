import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EmailI, OnbI, UserI } from 'src/app/models/app-interface';
import { AppService } from 'src/app/services/app.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  constructor(private appService: AppService) { }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',

    eventClick: this.eventClick.bind(this),
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    slotMinTime: '06:00:00',
    slotMaxTime: '18:00:00',
    events: [],
    height: 'auto',
    contentHeight: 'auto'

  };
  events: OnbI[] = [];
  users: UserI[] = [];

  modal: Boolean = false;
  modalData = {
    title: '',
    startDate: '',
    endDate: ''
  };

  async ngOnInit(): Promise<void> {
    this.events = await this.appService.getCalendar();
    this.calendarOptions.events = this.events.map(e => ({
      title: e.eventName,
      start: e.startDate,
      end: e.endDate
    }));
    this.users = await this.appService.getAllUsers();

    if (!sessionStorage.getItem('emailSent')) {
      await this.sendEmails();
    }
  }

  eventClick(arg: any) {
    const startDateStr = arg.event.start.toISOString().split('T')[0];
    const endDateStr = arg.event.end.toISOString().split('T')[0];

    this.modalData = {
      title: arg.event.title,
      startDate: startDateStr,
      endDate: endDateStr
    }

    this.modal = true;
  }

  async sendEmails() {
    const today = new Date();
    const oneWeekLater00 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const oneWeekLater24 = new Date(oneWeekLater00);
    oneWeekLater24.setHours(oneWeekLater24.getHours() + 24);

    const upcomingEvents = this.events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= oneWeekLater00 && eventDate <= oneWeekLater24;
    });

    const emails: EmailI =
    {
      to: [''],
      subject: 'Onboarding disponible',
      body: ''
    }

    emails.to = this.users.map(u => {
      return u.email;
    });

    if (upcomingEvents.length !== 0) {
      emails.subject = `Este correo tiene como fin recordar que en una semana estarán disponibles los siguientes onboardings: ${upcomingEvents}`
      sessionStorage.setItem('emailSent', 'true');
      await this.appService.sendEmail(emails);
    }
  }
  close() {
    this.modal = false;
  }
}
