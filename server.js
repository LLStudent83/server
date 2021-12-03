/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable default-case */

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const { v4: uuidv4 } = require('uuid');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

const tickets = [];
let action = null;
let ticketFull = null;
app.use(async (ctx) => {
  console.log('metod GET or POST', ctx.request.method);
  if (ctx.request.method === 'POST') {
    console.log('body', ctx.request.body);
    action = ctx.request.body.action;
  } else {
    console.log('query', ctx.request.query);
    action = ctx.request.query.action;
  }
  console.log('action', action);
  switch (action) {
    case 'allTickets':
      console.log('сработал allTickets');
      console.log('tickets', tickets);
      ctx.response.body = tickets;
      break;
    case 'createTicket': {
      // tickets.length = 0; // Удалитььььь
      console.log('сработал createTicket');
      ticketFull = {
        id: uuidv4(),
        name: ctx.request.body.short,
        description: ctx.request.body.full,
        status: false,
        created: new Date().toLocaleString().slice(0, -3),
      };

      tickets.push(ticketFull);
      console.log('ticketFull', ticketFull);
      ctx.response.body = ticketFull;
      break;
    }

    case 'changeTicket': {
      console.log('сработал changeTicket');
      if (ctx.request.method === 'POST') {
        console.log('body', ctx.request.body);
        const idTicket = ctx.request.body.id;
        ticketFull = tickets.find((elem) => {
          if (elem.id === idTicket) return elem;
        });
        console.log('CHЕT Tikful', ticketFull);
        ticketFull.name = ctx.request.body.short;
        ticketFull.description = ctx.request.body.full;
        ticketFull.status = ctx.request.body.status;
        ctx.response.body = ticketFull;
      } else {
        const idTicket = ctx.request.query.id;
        console.log('idTicket', idTicket);

        ticketFull = tickets.find((elem) => {
          if (elem.id === idTicket) return elem;
        });
        ticketFull.status = ctx.request.query.status;
        ctx.response.body = ticketFull;
        console.log('Ticket', ticketFull);
      }

      break;
    }

    case 'ticketById': {
      console.log('сработал ticketById');

      const idTicket = ctx.request.query.id;
      console.log('idTicket', idTicket);

      const ticket = tickets.find((elem) => {
        if (elem.id === idTicket) return elem;
      });
      console.log('ticket', ticket);

      ctx.response.body = ticket;
      break;
    }
    case 'deleteTicket': {
      console.log('сработал deleteTicket');
      const idTicket = ctx.request.query.id;
      const ticketIndex = tickets.findIndex((elem) => {
        if (elem.id === idTicket) return elem;
      });
      if (ticketIndex === -1) {
        const response = {
          error: 'Задача не найдена',
        };
        ctx.response.body = response;
      } else {
        tickets.splice(ticketIndex, 1);
        ctx.response.body = 'OK';
      }

      break;
    }
  }
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  });
  console.log('сейчас отправится ответ');
  console.log('все тикеты', tickets);
});

const port = process.env.PORT || 8080;
// const server = http.createServer(app.callback()).listen(8080);
const server = http.createServer(app.callback()).listen(port);
