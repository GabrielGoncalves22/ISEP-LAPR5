
import * as express from 'express'

export abstract class BaseController {
  // or even private
  protected req: express.Request;
  protected res: express.Response;
  protected next: express.NextFunction;

  protected abstract executeImpl (): Promise<void | any>;

  public execute (req: express.Request, res: express.Response, next: express.NextFunction): void {
    this.req = req;
    this.res = res;
    this.next = next;
    
    this.executeImpl();
  }

  public static jsonResponse (res: express.Response, code: number, message: string | any) {
    return res.status(code).json({ message })
  }

  public ok<T> (res: express.Response, dto?: T) {
    if (!!dto) {
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created (res: express.Response, info?: string | any) {
    res.statusCode = 201;
    return res.json(info);
  }

  public clientError (res: express.Response, message?: string) {
    res.statusCode = 400;
    return res.json(message);
  }

  public unauthorized (res: express.Response, message?: string) {
    res.statusCode = 401;
    return res.json(message);
  }

  public paymentRequired (res: express.Response, message?: string) {
    res.statusCode = 402;
    return res.json(message);
  }

  public forbidden (res: express.Response, message?: string) {
    res.statusCode = 403;
    return res.json(message);
  }

  public notFound (res: express.Response, message?: string) {
    res.statusCode = 404;
    return res.json(message);
  }

  public conflict (res: express.Response, message?: string) {
    res.statusCode = 409;
    return res.json(message);
  }

  public tooMany (res: express.Response, message?: string) {
    res.statusCode = 429;
    return res.json(message);
  }

  public badRequest (res: express.Response, message?: string) {
    res.statusCode = 400;
    return res.json(message);
  }

  public fail (error: Error | string) {
    console.log(error);
    return this.res.status(500).json({
      message: error.toString()
    })
  }
}