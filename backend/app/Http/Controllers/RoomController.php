<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Models\Room;
use App\Models\UploadImages;


class RoomController extends Controller
{
    public function index(){
        $room = Room::all();
        // dd($room);
        return view('testBackend.createRoom',compact(
            'room'
        ));
    }

    public function adminRoom(){
        $room = Room::all();
        // dd($room);
        return view('testBackend.adminRoom',compact(
            'room'
        ));
    }

    public function createRoom(Request $req){
        $req-> validate([
            'name' => 'required|string',
            'price' => 'required|integer',
            'type' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);
        $input = $req->all();
        if ($image = $req->file('image')) {
            $destinationPath = 'BE/products/images/';
            $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();
            $image->move($destinationPath, $profileImage);
            $input['image'] = "$profileImage";
        }
        Room::create($input);

        return redirect()->route('admin.adminRoom');
    }

    public function editRoom($id){
        $room = Room::find($id);
        return view('testBackend.editRoom',compact(
            'room'
        ));
    }

    public function updateRoom(Request $req,$id){
        $room = Room::find($id);
    // Kiểm tra xem có tải lên file ảnh mới hay không
        if ($req->hasFile('image')) {
            // Lấy file ảnh từ request
            $image = $req->file('image');

            // Đặt đường dẫn lưu ảnh
            $destinationPath = 'BE/products/images/';
            $profileImage = date('YmdHis') . "." . $image->getClientOriginalExtension();

            // Di chuyển file ảnh vào thư mục đích
            $image->move($destinationPath, $profileImage);

            // Cập nhật đường dẫn của ảnh mới vào cơ sở dữ liệu
            $room->image = "$profileImage";
        }

        // Cập nhật các thuộc tính khác
        $room->name = $req->input('name');
        $room->price = $req->input('price');
        $room->type = $req->input('type');
        // Lưu thay đổi vào cơ sở dữ liệu
        $room->save();
    return redirect()->route('admin.adminRoom')->withSuccess('Cập nhật thành công sản phẩm');
    }

    public function deleteRoom($id){
        $room = Room::find($id);
        $room->delete();
        return redirect()->route('admin.adminRoom')->withSuccess('Xóa thành công sản phẩm');
    }

    public function searchRoom(Request $req){
        $keyword = $req->input('keyword');
        $room = Room::where('name', 'like', "%$keyword%")
                            ->orWhere('price', 'like', "%$keyword%")
                            ->orWhere('id', 'like', "%$keyword%")
                            ->orWhere('type', 'like', "%$keyword%")
                            ->paginate(3);
        return view('testBackend.adminRoom',compact(
            'room'
        ))->with('message', 'Results found.');
    }


    public function indexUpload(){
        $room = UploadImages::all();
        return view('testBackend.images',compact(
            'room'
        ));
    }
    public function uploadImages(Request $req){
        // Validate ảnh
        $req->validate([
            'main_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'additional_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);
        $imageData = [];
        
        // Xử lý ảnh chính
        if ($mainImage = $req->file('main_image')) {
            $mainImageName = time() . '_main.' . $mainImage->getClientOriginalExtension();
            $mainImage->move(public_path('images'), $mainImageName);
            $imageData['main_image'] = $mainImageName;
        }
        
        // Xử lý ảnh phụ chỉ khi chúng tồn tại
        if ($req->hasFile('additional_images')) {
            foreach ($req->file('additional_images') as $key => $image) {
                $imageName = time() . '_sub_' . $key . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
                $imageData['additional_images'][] = $imageName;
            }
        }
        
        // Lưu dữ liệu hình ảnh vào file JSON
        $jsonFilePath = public_path('images_data.json');
        if (File::exists($jsonFilePath)) {
            $existingData = json_decode(File::get($jsonFilePath), true);
            $existingData[] = $imageData;
            File::put($jsonFilePath, json_encode($existingData, JSON_PRETTY_PRINT));
        } else {
            // Ghi dữ liệu mới với định dạng đẹp và xuống dòng nếu file chưa tồn tại
            File::put($jsonFilePath, json_encode([$imageData], JSON_PRETTY_PRINT));
        }
        return redirect()->route('admin.adminRoom')->with('success', 'Room created successfully');
    }


}
