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

  // 修复图片
  async create(img: any) {
    const imgBase = await readFile(img.path, { encoding: 'base64' });
    const imgBase64 = this.prefix + imgBase;
    const { expires, access_token } = await this.readTokenFile();
    if (expires && expires > new Date().getTime()) {
      const res = await post(
        AIIMGAPI.postImageDefinitionEnhance,
        {
          image: imgBase64,
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
      return { image: this.prefix + res.data.image };
    } else {
      await this.imgAccessToken();
      this.create(img);
    }
  }

  // 黑白图片上色

  async createColor(img: any) {
    const imgBase = await readFile(img.path, { encoding: 'base64' });
    const imgBase64 = this.prefix + imgBase;
    const { expires, access_token } = await this.readTokenFile();
    if (expires && expires > new Date().getTime()) {
      const res = await post(
        AIIMGAPI.postImageColorization,
        {
          image: imgBase64,
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
      return { image: this.prefix + res.data.image };
    } else {
      await this.imgAccessToken();
      this.create(img);
    }
  }
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
