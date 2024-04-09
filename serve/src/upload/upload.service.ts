import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'path';
import { AIIMG, AIIMGAPI } from '../constant/ai.img';
import { get, post } from '../request';

@Injectable()
export class UploadService {
  public prefix = 'data:image/jpeg;base64,';
  private img_access_token: string;
  private img_access_token_expires: number;

  // 获取文件中的token信息
  async readTokenFile() {
    let token = '';
    let expires = 0;
    let access_token = '';

    // 获取token信息,查看是否需要读取文件中的token
    if (
      !this.img_access_token ||
      new Date().getTime() > this.img_access_token_expires
    ) {
      //读取文件
      token = await readFile(
        join(__dirname, '../../token/img_access_token.js'),
        {
          encoding: 'utf-8',
        },
      );
      expires = JSON.parse(token).expires;
      access_token = JSON.parse(token).access_token;

      this.img_access_token = access_token;
      this.img_access_token_expires = expires;
      console.log('读取文件');
    } else {
      expires = this.img_access_token_expires;
      access_token = this.img_access_token;
    }

    return { expires, access_token };
  }

  // 发送ai处理图片
  async sendImg(args) {
    const { img, apiOptions, resField, callback } = args;
    const { api, body = {} } = apiOptions;
    const imgBase = await readFile(img.path, { encoding: 'base64' });
    const imgBase64 = this.prefix + imgBase;

    const { expires, access_token } = await this.readTokenFile();

    // 判断token是否过期
    if (expires && expires > new Date().getTime()) {
      const res = await post(
        api,
        {
          image: imgBase64,
          ...body,
        },
        {
          params: {
            access_token,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log('发送图片', res.data);
      return { image: this.prefix + res.data[resField ?? 'image'] };
    } else {
      await this.imgAccessToken();
      callback(img);
    }
  }

  // 修复图片
  async create(img: any) {
    return this.sendImg({
      img,
      apiOptions: { api: AIIMGAPI.postImageDefinitionEnhance },
      callback: this.create,
    });
  }

  // 黑白图片上色
  async createColor(img: any) {
    return this.sendImg({
      img,
      apiOptions: { api: AIIMGAPI.postImageColorization },
      callback: this.create,
    });
  }

  // 图片降噪
  async createNoiseReduction(img: any) {
    return this.sendImg({
      img,
      apiOptions: { api: AIIMGAPI.postImageDenoise, body: { option: 100 } },
      resField: 'result',
      callback: this.create,
    });
  }

  // 获取ai接口access_token
  async imgAccessToken() {
    const res = await get('https://aip.baidubce.com/oauth/2.0/token', {
      params: {
        grant_type: AIIMG.GRANTTYPE,
        client_id: AIIMG.CLIENTID,
        client_secret: AIIMG.CLIENTSECRET,
      },
    });
    const data: any = res.data;
    data.expires = data.expires_in * 1000 + new Date().getTime();
    this.img_access_token = data;

    await writeFile(
      join(__dirname, '../../token/img_access_token.js'),
      JSON.stringify(data),
    );
  }
}
