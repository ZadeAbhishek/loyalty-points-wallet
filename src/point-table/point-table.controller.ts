import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Request,
    UseGuards,
    Put,
    Body,
  } from '@nestjs/common';
  import { AuthGuard } from '../auth/auth.guard'; // Importing the AuthGuard to protect routes
  import { PointTableService } from './point-table.service';
  import { UpdatePointsDto } from 'src/Dto/updatePointsDto';

  @Controller('points')
export class PointTableController {
    constructor(private pointTableService: PointTableService) {}
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Get('totalpoints')
    async getTotalPoints(@Request() req) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.pointTableService.getPoints(userEmail);
            if(!user) return {message:'No user Found'}
            return (await user).TotalPoints; //successfull return
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
    }

        @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Get('validpoints')
    async getValidPoints(@Request() req) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.pointTableService.getPoints(userEmail);
            if(!user) return {message:'No user Found'}
            return (await user).CurrPoints; //successfull return
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Put('earnPoints')
    async earnPoints(@Request() req, @Body() updatePointsDto:UpdatePointsDto ) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.pointTableService.earnPoints(userEmail,updatePointsDto.points)
            if(!user) return {message:'No user Found'}
            return {message: `SuccessFull Updated`}; //successfull return
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
    }


    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Put('burnPoints')
    async burnPoints(@Request() req, @Body() updatePointsDto:UpdatePointsDto ) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.pointTableService.burnPoints(userEmail,updatePointsDto.points)
            if(!user) return {message:'No user Found'}
            return {message: 'SuccessFull Updated'}; //successfull return
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
    }
}
